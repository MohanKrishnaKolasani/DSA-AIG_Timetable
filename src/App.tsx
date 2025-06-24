
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Overview from "./pages/Overview";
import MonthOverview from "./pages/MonthOverview";
import WeeklySchedule from "./pages/WeeklySchedule";
import WeeklyScheduleList from "./pages/WeeklyScheduleList";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } />
          <Route path="/month/1" element={
            <ProtectedRoute>
              <MonthOverview monthId="1"/>
            </ProtectedRoute>
          } />
          <Route path="/month/2" element={
            <ProtectedRoute>
              <MonthOverview monthId="2"/>
            </ProtectedRoute>
          } />
          <Route path="/month/3" element={
            <ProtectedRoute>
              <MonthOverview monthId="3"/>
            </ProtectedRoute>
          } />
          <Route path="/week/:weekId" element={
            <ProtectedRoute>
              <WeeklySchedule />
            </ProtectedRoute>
          } />
          <Route path="/schedules" element={
            <ProtectedRoute>
              <WeeklyScheduleList />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;