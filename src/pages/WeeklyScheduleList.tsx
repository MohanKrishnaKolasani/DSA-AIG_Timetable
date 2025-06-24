
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { weeklySchedules } from '@/data/scheduleData';
import { ChevronDown, ChevronRight, Calendar, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const WeeklyScheduleList = () => {
  const [openWeeks, setOpenWeeks] = useState<{ [key: number]: boolean }>({});

  const toggleWeek = (weekNumber: number) => {
    setOpenWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Weekly Schedules
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete 12-week DSA + AI Generalist curriculum breakdown
          </p>
        </div>

        {/* Weekly Schedule Cards */}
        <div className="space-y-4">
          {weeklySchedules.map((week) => (
            <Card key={week.week} className="overflow-hidden">
              <Collapsible 
                open={openWeeks[week.week]} 
                onOpenChange={() => toggleWeek(week.week)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          Week {week.week}
                        </Badge>
                        <div>
                          <CardTitle className="text-xl">{week.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Click to expand detailed schedule
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/week/${week.week}`}>
                            View Full Schedule
                          </Link>
                        </Button>
                        {openWeeks[week.week] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* DSA Topics */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 mb-3">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-600">DSA Topics</h3>
                        </div>
                        <div className="space-y-2">
                          {week.dsaTopics.map((topic, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Topics */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 mb-3">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-600">AI Topics</h3>
                        </div>
                        <div className="space-y-2">
                          {week.aiTopics.map((topic, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Schedule Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Daily Time Slots
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>10:00–10:50: DSA Learning</div>
                        <div>11:00–11:50: DSA Practice</div>
                        <div>12:00–12:50: DSA Problems</div>
                        <div>14:00–14:50: AI Topics</div>
                        <div>15:00–15:50: AI Practice</div>
                        <div>18:00–18:50: Resource Hunt</div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WeeklyScheduleList;
