
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { weeklySchedules } from '@/data/scheduleData';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, BookOpen, Zap, CheckCircle, Target, ArrowLeft, ArrowRight } from 'lucide-react';

const WeeklySchedule = () => {
  const { weekId } = useParams();
  const { user } = useAuthStore();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const weekNumber = parseInt(weekId || '1');
  const weekData = weeklySchedules.find(w => w.week === weekNumber);

  useEffect(() => {
    if (user && weekData) {
      fetchCompletedTasks();
    }
  }, [user, weekData]);

  const fetchCompletedTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('task_id')
        .eq('user_id', user?.id)
        .eq('week_number', weekNumber);

      if (error) throw error;

      const completed = new Set(data?.map(item => item.task_id) || []);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        // Add to completed tasks
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user?.id,
            week_number: weekNumber,
            task_id: taskId,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;

        setCompletedTasks(prev => new Set([...prev, taskId]));
        toast({
          title: "Task completed!",
          description: "Great job staying on track with your schedule.",
        });
      } else {
        // Remove from completed tasks
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user?.id)
          .eq('task_id', taskId);

        if (error) throw error;

        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!weekData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Week not found</h1>
          <p className="text-gray-600">The requested week does not exist.</p>
        </div>
      </Layout>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['10:00–10:50', '11:00–11:50', '12:00–12:50', '14:00–14:50', '15:00–15:50', '18:00–18:50'];

  const getTaskType = (task: string) => {
    if (task.toLowerCase().includes('ai') || task.toLowerCase().includes('prompt')) {
      return 'ai';
    }
    return 'dsa';
  };

  const getTaskIcon = (task: string) => {
    return getTaskType(task) === 'ai' ? Zap : BookOpen;
  };

  const getTaskColor = (task: string) => {
    return getTaskType(task) === 'ai' ? 'text-purple-600' : 'text-blue-600';
  };

  const getTaskBg = (task: string) => {
    return getTaskType(task) === 'ai' ? 'bg-purple-50' : 'bg-blue-50';
  };

  const getTotalTasks = () => {
    let total = 0;
    days.forEach(day => {
      timeSlots.forEach(time => {
        if (weekData.schedule[day]?.[time]) total++;
      });
    });
    return total;
  };

  const getCompletedCount = () => completedTasks.size;
  const progressPercentage = (getCompletedCount() / getTotalTasks()) * 100;

  const previousWeek = weekNumber > 1 ? weekNumber - 1 : null;
  const nextWeek = weekNumber < 12 ? weekNumber + 1 : null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {previousWeek && (
              <Button asChild variant="outline" size="sm">
                <Link to={`/week/${previousWeek}`} className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Week {previousWeek}</span>
                </Link>
              </Button>
            )}
          </div>
          
          <Button asChild variant="outline" size="sm">
            <Link to="/schedules">All Schedules</Link>
          </Button>

          <div className="flex items-center space-x-4">
            {nextWeek && (
              <Button asChild variant="outline" size="sm">
                <Link to={`/week/${nextWeek}`} className="flex items-center space-x-2">
                  <span>Week {nextWeek}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Week {weekData.week}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {weekData.title}
          </h1>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Week {weekData.week} Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Tasks Completed</span>
                <span>{getCompletedCount()} / {getTotalTasks()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm opacity-90">
                {progressPercentage.toFixed(1)}% Complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>DSA Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekData.dsaTopics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span>AI Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekData.aiTopics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-4 h-4 bg-purple-600 rounded-full flex-shrink-0"></div>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Schedule Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Weekly Schedule</span>
            </CardTitle>
            <CardDescription>
              Click the checkboxes to track your progress through each time slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold bg-gray-50">Time</th>
                    {days.map(day => (
                      <th key={day} className="text-left p-3 font-semibold bg-gray-50 min-w-[200px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(timeSlot => (
                    <tr key={timeSlot} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-700 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{timeSlot}</span>
                        </div>
                      </td>
                      {days.map(day => {
                        const task = weekData.schedule[day]?.[timeSlot];
                        const taskId = `${weekNumber}-${day}-${timeSlot}`;
                        const isCompleted = completedTasks.has(taskId);
                        const TaskIcon = task ? getTaskIcon(task) : Clock;

                        return (
                          <td key={day} className="p-3">
                            {task ? (
                              <div className={`p-3 rounded-lg ${getTaskBg(task)} border-l-4 ${getTaskType(task) === 'ai' ? 'border-purple-500' : 'border-blue-500'}`}>
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={(checked) => handleTaskToggle(taskId, !!checked)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start space-x-2">
                                      <TaskIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getTaskColor(task)}`} />
                                      <span className={`text-sm leading-relaxed ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                        {task}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 text-sm italic">
                                No task scheduled
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Lunch Break Note */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-amber-800">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Daily Schedule Note:</span>
            </div>
            <p className="text-amber-700 mt-2">
              Remember to take your lunch break from 1:00 PM – 2:00 PM and ensure you get quality sleep from 10:00 PM – 6:00 AM for optimal learning performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeeklySchedule;
