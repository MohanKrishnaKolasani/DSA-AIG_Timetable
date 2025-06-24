
import React from 'react';
import Layout from '@/components/Layout';
import ProgressTracker from '@/components/ProgressTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, BookOpen, Zap, Calendar, CheckCircle } from 'lucide-react';

const Overview = () => {
  const dailySchedule = [
    { time: '10:00 AM – 12:50 PM', activity: 'DSA Learning', icon: BookOpen, color: 'bg-blue-500' },
    { time: '1:00 PM – 2:00 PM', activity: 'Lunch Break', icon: Clock, color: 'bg-gray-500' },
    { time: '2:00 PM – 3:50 PM', activity: 'DSA Practice (problems, contests)', icon: Target, color: 'bg-green-500' },
    { time: '4:00 PM – 6:00 PM', activity: 'Rest/Physical Activity', icon: Zap, color: 'bg-orange-500' },
    { time: '6:00 PM – 7:50 PM', activity: 'AI Generalist Topics + Hands-on', icon: Zap, color: 'bg-purple-500' },
    { time: '8:00 PM – 9:00 PM', activity: 'Resource hunt for next day', icon: BookOpen, color: 'bg-indigo-500' },
    { time: '10:00 PM – 6:00 AM', activity: 'Sleep', icon: Clock, color: 'bg-slate-500' },
  ];

  const phases = [
    {
      month: 'Month 1',
      title: 'Fundamentals & Prompting Mastery',
      description: 'Build strong foundations in basic data structures and advanced AI prompting techniques.',
      topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Advanced Prompting', 'OpenAI Playground'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      month: 'Month 2',
      title: 'Intermediate Concepts & AI Cloning',
      description: 'Dive deeper into algorithms and explore cutting-edge AI cloning technologies.',
      topics: ['Hash Tables', 'Sorting Algorithms', 'Greedy Algorithms', 'Diffusion Models', 'AI Voice Cloning', 'Content Replication'],
      color: 'from-green-500 to-green-600',
    },
    {
      month: 'Month 3',
      title: 'Advanced DSA & AI System Building',
      description: 'Master complex algorithms and build comprehensive AI automation systems.',
      topics: ['Dynamic Programming', 'Advanced Trees', 'AI Agents', 'Workflow Design', 'No-code Tools', 'Final Project'],
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            DSA + AI Generalist 3-Month Schedule
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your coding skills with our comprehensive 12-week program combining 
            Data Structures & Algorithms with cutting-edge AI topics. Track your progress 
            and master both domains systematically.
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressTracker />

        {/* Program Phases */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Program Phases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-5`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {phase.month}
                    </Badge>
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </div>
                  <CardTitle className="text-xl">{phase.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {phase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Key Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {phase.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Study Schedule */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Daily Study Slots</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Your Daily Schedule</span>
              </CardTitle>
              <CardDescription>
                Follow this structured timeline to maximize your learning efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailySchedule.map((slot, index) => {
                  const Icon = slot.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 ${slot.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{slot.time}</div>
                        <div className="text-gray-600">{slot.activity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
