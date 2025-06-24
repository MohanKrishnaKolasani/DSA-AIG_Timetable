import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { Plus, Link as LinkIcon, FileText, ExternalLink, Trash2, Edit } from 'lucide-react';
import { weeklySchedules } from '@/data/scheduleData';

interface Resource {
  id: string;
  topic_name: string;
  week_number: number;
  resource_type: 'link' | 'pdf' | 'note';
  title: string;
  url?: string;
  content?: string;
  created_at: string;
}

const Resources = () => {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [newResource, setNewResource] = useState({
    topic_name: '',
    week_number: 1,
    resource_type: 'link' as 'link' | 'pdf' | 'note',
    title: '',
    url: '',
    content: ''
  });

  useEffect(() => {
    if (user) {
      fetchResources();
    }
  }, [user]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', user?.id)
        .order('week_number', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure resource_type is properly typed
      const typedResources = (data || []).map(resource => ({
        ...resource,
        resource_type: resource.resource_type as 'link' | 'pdf' | 'note'
      }));
      
      setResources(typedResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    try {
      const { error } = await supabase
        .from('resources')
        .insert({
          user_id: user?.id,
          topic_name: newResource.topic_name,
          week_number: newResource.week_number,
          resource_type: newResource.resource_type,
          title: newResource.title,
          url: newResource.resource_type === 'note' ? null : newResource.url,
          content: newResource.resource_type === 'note' ? newResource.content : null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully!",
      });

      setNewResource({
        topic_name: '',
        week_number: 1,
        resource_type: 'link',
        title: '',
        url: '',
        content: ''
      });
      setIsAddingResource(false);
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;

    try {
      const { error } = await supabase
        .from('resources')
        .update({
          topic_name: editingResource.topic_name,
          week_number: editingResource.week_number,
          resource_type: editingResource.resource_type,
          title: editingResource.title,
          url: editingResource.resource_type === 'note' ? null : editingResource.url,
          content: editingResource.resource_type === 'note' ? editingResource.content : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingResource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource updated successfully!",
      });

      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully!",
      });

      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getResourcesByWeek = (weekNumber: number) => {
    return resources.filter(resource => resource.week_number === weekNumber);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Learning Resources
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Manage your study materials, links, and notes
            </p>
          </div>
          
          <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Add a link, PDF, or note for your study topics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic Name</Label>
                  <Input
                    id="topic"
                    value={newResource.topic_name}
                    onChange={(e) => setNewResource({...newResource, topic_name: e.target.value})}
                    placeholder="e.g., Arrays, Binary Trees, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="week">Week Number</Label>
                  <Select 
                    value={newResource.week_number.toString()} 
                    onValueChange={(value) => setNewResource({...newResource, week_number: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 12}, (_, i) => i + 1).map(week => (
                        <SelectItem key={week} value={week.toString()}>
                          Week {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Resource Type</Label>
                  <Select 
                    value={newResource.resource_type} 
                    onValueChange={(value: 'link' | 'pdf' | 'note') => setNewResource({...newResource, resource_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="Resource title"
                  />
                </div>
                {newResource.resource_type !== 'note' && (
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                )}
                {newResource.resource_type === 'note' && (
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newResource.content}
                      onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                      placeholder="Your notes..."
                      className="min-h-[100px]"
                    />
                  </div>
                )}
                <Button onClick={handleAddResource} className="w-full">
                  Add Resource
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Week Filter */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="week-filter">Filter by Week:</Label>
          <Select 
            value={selectedWeek.toString()} 
            onValueChange={(value) => setSelectedWeek(parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Weeks</SelectItem>
              {Array.from({length: 12}, (_, i) => i + 1).map(week => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        {selectedWeek === 0 ? (
          // Show all weeks
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-1">
              {Array.from({length: 12}, (_, i) => i + 1).map(week => (
                <TabsTrigger key={week} value={week.toString()} className="text-xs">
                  W{week}
                </TabsTrigger>
              ))}
            </TabsList>
            {Array.from({length: 12}, (_, i) => i + 1).map(week => (
              <TabsContent key={week} value={week.toString()}>
                <WeekResourcesGrid 
                  weekNumber={week}
                  resources={getResourcesByWeek(week)}
                  onEdit={setEditingResource}
                  onDelete={handleDeleteResource}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // Show selected week
          <WeekResourcesGrid 
            weekNumber={selectedWeek}
            resources={getResourcesByWeek(selectedWeek)}
            onEdit={setEditingResource}
            onDelete={handleDeleteResource}
          />
        )}

        {/* Edit Resource Dialog */}
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            {editingResource && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-topic">Topic Name</Label>
                  <Input
                    id="edit-topic"
                    value={editingResource.topic_name}
                    onChange={(e) => setEditingResource({...editingResource, topic_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                  />
                </div>
                {editingResource.resource_type !== 'note' && (
                  <div>
                    <Label htmlFor="edit-url">URL</Label>
                    <Input
                      id="edit-url"
                      value={editingResource.url || ''}
                      onChange={(e) => setEditingResource({...editingResource, url: e.target.value})}
                    />
                  </div>
                )}
                {editingResource.resource_type === 'note' && (
                  <div>
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      value={editingResource.content || ''}
                      onChange={(e) => setEditingResource({...editingResource, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
                <Button onClick={handleUpdateResource} className="w-full">
                  Update Resource
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const WeekResourcesGrid = ({ 
  weekNumber, 
  resources, 
  onEdit, 
  onDelete 
}: { 
  weekNumber: number;
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}) => {
  const weekData = weeklySchedules.find(w => w.week === weekNumber);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Week {weekNumber}</h2>
        {weekData && (
          <p className="text-gray-600">{weekData.title}</p>
        )}
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources added for Week {weekNumber} yet.</p>
            <p className="text-sm text-gray-500 mt-2">Click "Add Resource" to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {resource.resource_type === 'link' && <LinkIcon className="w-4 h-4 text-blue-600" />}
                    {resource.resource_type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                    {resource.resource_type === 'note' && <FileText className="w-4 h-4 text-green-600" />}
                    <Badge variant="outline" className="text-xs">
                      {resource.resource_type}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onEdit(resource)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onDelete(resource.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="text-sm">
                  {resource.topic_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {resource.resource_type === 'note' ? (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {resource.content}
                  </p>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 truncate">
                      {resource.url}
                    </span>
                    {resource.url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
