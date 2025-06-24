import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { weeklySchedules } from '@/data/scheduleData';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Calendar, BookOpen, Zap, Target, TrendingUp, Award } from 'lucide-react';

type MonthOverviewProps = {
  monthId: string;
};

const MonthOverview =  ({ monthId }: MonthOverviewProps)  => {
  const { user } = useAuthStore();
  const [weekProgress, setWeekProgress] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  const monthNumber = parseInt(monthId || '1');
  
  // Define weeks for each month - 4 weeks per month
  const getWeeksForMonth = (month: number) => {
    switch (month) {
      case 1: return [1, 2, 3, 4];
      case 2: return [5, 6, 7, 8];
      case 3: return [9, 10, 11, 12];
      default: return [1, 2, 3, 4];
    }
  };

  const monthWeeks = weeklySchedules.filter(week => 
    getWeeksForMonth(monthNumber).includes(week.week)
  );

  const monthTitles = {
    1: "Foundation Building",
    2: "Advanced Structures", 
    3: "Algorithms & AI Mastery"
  };

  const monthDescriptions = {
    1: "Master the fundamentals of arrays, strings, sorting, searching, and basic AI concepts",
    2: "Dive deep into advanced data structures, pattern matching, and neural networks", 
    3: "Explore graph algorithms, dynamic programming, and generative AI"
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user, monthNumber]);

  const fetchProgress = async () => {
    try {
      const progressPromises = monthWeeks.map(async (week) => {
        const { data, error } = await supabase
          .from('user_progress')
          .select('task_id')
          .eq('user_id', user?.id)
          .eq('week_number', week.week);

        if (error) throw error;

        const totalTasks = getTotalTasksForWeek(week.week);
        const completedTasks = data?.length || 0;
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return { week: week.week, percentage };
      });

      const results = await Promise.all(progressPromises);
      const progressMap = results.reduce((acc, { week, percentage }) => {
        acc[week] = percentage;
        return acc;
      }, {} as { [key: number]: number });

      setWeekProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalTasksForWeek = (weekNumber: number) => {
    const week = weeklySchedules.find(w => w.week === weekNumber);
    if (!week) return 0;

    let total = 0;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['10:00–10:50', '11:00–11:50', '12:00–12:50', '14:00–14:50', '15:00–15:50', '18:00–18:50'];

    days.forEach(day => {
      timeSlots.forEach(time => {
        if (week.schedule[day]?.[time]) total++;
      });
    });

    return total;
  };

  const getMonthProgress = () => {
    const weekPercentages = Object.values(weekProgress);
    if (weekPercentages.length === 0) return 0;
    return weekPercentages.reduce((sum, percentage) => sum + percentage, 0) / weekPercentages.length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Month {monthNumber} progress...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Month {monthNumber}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {monthTitles[monthNumber as keyof typeof monthTitles]}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {monthDescriptions[monthNumber as keyof typeof monthDescriptions]}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>Month {monthNumber} Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>{getMonthProgress().toFixed(1)}%</span>
              </div>
              <Progress value={getMonthProgress()} className="bg-white/20" />
              <div className="text-sm opacity-90">
                Stay on track with your DSA and AI learning journey
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Month Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <BookOpen className="w-5 h-5" />
                <span>DSA Focus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">
                {monthWeeks.map(week => week.dsaTopics[0]).join(', ')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Zap className="w-5 h-5" />
                <span>AI Focus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">
                {monthWeeks.map(week => week.aiTopics[0]).join(', ')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Target className="w-5 h-5" />
                <span>Key Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">
                {monthWeeks.map(week => week.title).join(', ')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Weekly Breakdown
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {monthWeeks.map((week) => (
              <Card key={week.week} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Week {week.week}</Badge>
                    <span className="text-sm text-gray-500">
                      {weekProgress[week.week]?.toFixed(0) || 0}% complete
                    </span>
                  </div>
                  <CardTitle className="text-lg">{week.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={weekProgress[week.week] || 0} className="h-2" />
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-600 text-sm mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        DSA Focus
                      </h4>
                      <div className="space-y-1">
                        {week.dsaTopics.slice(0, 2).map((topic, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                            {topic}
                          </div>
                        ))}
                        {week.dsaTopics.length > 2 && (
                          <div className="text-xs text-gray-500 ml-3.5">
                            +{week.dsaTopics.length - 2} more topics
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-600 text-sm mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        AI Focus
                      </h4>
                      <div className="space-y-1">
                        {week.aiTopics.slice(0, 2).map((topic, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2 flex-shrink-0"></div>
                            {topic}
                          </div>
                        ))}
                        {week.aiTopics.length > 2 && (
                          <div className="text-xs text-gray-500 ml-3.5">
                            +{week.aiTopics.length - 2} more topics
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="sm">
                    <Link to={`/week/${week.week}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default MonthOverview;