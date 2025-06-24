
-- Enable RLS on existing tables if not already enabled
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.week_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_slot_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_progress table
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;
CREATE POLICY "Users can manage their own progress" 
  ON public.user_progress 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for topic_progress table  
DROP POLICY IF EXISTS "Users can view all topic progress" ON public.topic_progress;
CREATE POLICY "Users can view all topic progress" 
  ON public.topic_progress 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can manage topic progress" ON public.topic_progress;
CREATE POLICY "Users can manage topic progress" 
  ON public.topic_progress 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update topic progress" ON public.topic_progress;
CREATE POLICY "Users can update topic progress" 
  ON public.topic_progress 
  FOR UPDATE 
  USING (true);

-- Create RLS policies for week_progress table
DROP POLICY IF EXISTS "Users can view all week progress" ON public.week_progress;
CREATE POLICY "Users can view all week progress" 
  ON public.week_progress 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can manage week progress" ON public.week_progress;
CREATE POLICY "Users can manage week progress" 
  ON public.week_progress 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update week progress" ON public.week_progress;
CREATE POLICY "Users can update week progress" 
  ON public.week_progress 
  FOR UPDATE 
  USING (true);

-- Create RLS policies for daily_slot_progress table
DROP POLICY IF EXISTS "Users can view all daily progress" ON public.daily_slot_progress;
CREATE POLICY "Users can view all daily progress" 
  ON public.daily_slot_progress 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can manage daily progress" ON public.daily_slot_progress;
CREATE POLICY "Users can manage daily progress" 
  ON public.daily_slot_progress 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update daily progress" ON public.daily_slot_progress;
CREATE POLICY "Users can update daily progress" 
  ON public.daily_slot_progress 
  FOR UPDATE 
  USING (true);

-- Create RLS policies for resources table
DROP POLICY IF EXISTS "Users can manage their own resources" ON public.resources;
CREATE POLICY "Users can manage their own resources" 
  ON public.resources 
  FOR ALL 
  USING (auth.uid() = user_id);
