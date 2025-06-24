
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Trophy, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProgressData {
  totalTasks: number;
  completedTasks: number;
  weeklyProgress: { [key: number]: number };
  currentStreak: number;
  currentWeek: number;
}

const ProgressTracker = () => {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<ProgressData>({
    totalTasks: 0,
    completedTasks: 0,
    weeklyProgress: {},
    currentStreak: 0,
    currentWeek: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Calculate progress statistics
      const totalTasks = 12 * 7 * 6; // 12 weeks * 7 days * 6 time slots per day
      const completedTasks = data?.length || 0;
      
      const weeklyProgress: { [key: number]: number } = {};
      for (let week = 1; week <= 12; week++) {
        const weekTasks = data?.filter(item => item.week_number === week).length || 0;
        const weekTotal = 7 * 6; // 7 days * 6 time slots
        weeklyProgress[week] = (weekTasks / weekTotal) * 100;
      }

      // Calculate current streak (consecutive days with completed tasks)
      const currentStreak = calculateCurrentStreak(data || []);
      
      // Calculate current week based on start date or progress
      const currentWeek = calculateCurrentWeek(data || []);

      setProgress({
        totalTasks,
        completedTasks,
        weeklyProgress,
        currentStreak,
        currentWeek,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = (progressData: any[]) => {
    if (progressData.length === 0) return 0;

    // Sort by completion date
    const sortedData = progressData
      .filter(item => item.completed_at)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

    if (sortedData.length === 0) return 0;

    // Get unique days with tasks completed
    const uniqueDays = [...new Set(sortedData.map(item => 
      new Date(item.completed_at).toDateString()
    ))];

    let streak = 0;
    const today = new Date();
    
    // Check if today has any completed tasks
    const todayStr = today.toDateString();
    let checkDate = new Date(today);
    
    // If today has tasks, start from today, otherwise start from yesterday
    if (!uniqueDays.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days backwards
    for (let i = 0; i < uniqueDays.length; i++) {
      const checkDateStr = checkDate.toDateString();
      if (uniqueDays.includes(checkDateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateCurrentWeek = (progressData: any[]) => {
    if (progressData.length === 0) return 1;
    
    // Find the highest week with progress
    const maxWeek = Math.max(...progressData.map(item => item.week_number));
    
    // If the current max week is complete, suggest next week
    const maxWeekTasks = progressData.filter(item => item.week_number === maxWeek).length;
    const weekTotal = 7 * 6; // 7 days * 6 time slots
    
    if (maxWeekTasks >= weekTotal && maxWeek < 12) {
      return maxWeek + 1;
    }
    
    return maxWeek;
  };

  const overallProgress = (progress.completedTasks / progress.totalTasks) * 100;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Trophy className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
          <Progress value={overallProgress} className="mt-2 bg-blue-400" />
          <p className="text-xs text-blue-100 mt-2">
            {progress.completedTasks} of {progress.totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <CheckCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.completedTasks}</div>
          <p className="text-xs text-green-100">
            Keep up the great work!
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Target className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.currentStreak} days</div>
          <p className="text-xs text-purple-100">
            {progress.currentStreak > 0 ? 'Amazing consistency!' : 'Start your streak today!'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Week</CardTitle>
          <Calendar className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Week {progress.currentWeek}</div>
          <Button asChild variant="secondary" size="sm" className="mt-2 text-orange-600">
            <Link to={`/week/${progress.currentWeek}`}>
              Go to Week
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
