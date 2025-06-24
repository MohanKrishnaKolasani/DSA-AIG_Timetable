
-- Drop the existing user_progress table if it exists
DROP TABLE IF EXISTS public.user_progress;

-- Create the correct user_progress table with task_id column
CREATE TABLE public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    task_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Enable RLS for user_progress table
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_progress table
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_week_number ON public.user_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_task_id ON public.user_progress(task_id);

-- Create resources table for storing links and PDFs
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_name TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('link', 'pdf', 'note')),
    title TEXT NOT NULL,
    url TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resources table
CREATE POLICY "Users can view their own resources" ON public.resources
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resources" ON public.resources
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resources" ON public.resources
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resources" ON public.resources
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for resources table
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON public.resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_week_number ON public.resources(week_number);
CREATE INDEX IF NOT EXISTS idx_resources_topic_name ON public.resources(topic_name);
