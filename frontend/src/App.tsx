import { useAuth0 } from "@auth0/auth0-react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./pages/Dashboard";
import BentoBoxView from "./pages/BentoBoxView";
import TimelineView from "./pages/TimelineView";
import ExcelView from "./pages/ExcelView";
import BucketView from "./pages/BucketView";
import KanbanView from "./pages/KanbanView";
import Resumes from "./pages/Resumes";
import Chat from "./pages/Chat";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function getBreadcrumb(pathname: string): string {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/applications/bento-box": "Bento Box View",
    "/applications/timeline": "Timeline View",
    "/applications/excel": "Excel View",
    "/applications/bucket": "Bucket View",
    "/applications/kanban": "Kanban View",
    "/resumes": "Resumes",
    "/chat": "AI Chat",
  };
  return routes[pathname] || "Dashboard";
}

function AppContent() {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/60 bg-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-light">
                    {breadcrumb}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications/bento-box" element={<BentoBoxView />} />
          <Route path="/applications/timeline" element={<TimelineView />} />
          <Route path="/applications/excel" element={<ExcelView />} />
          <Route path="/applications/bucket" element={<BucketView />} />
          <Route path="/applications/kanban" element={<KanbanView />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#8da9c4]/40 border-t-[#134074] rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground font-light">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4 rounded-3xl border border-border/60 bg-card/90 p-12 watercolor-shadow">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground font-light text-lg">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <CopilotSidebar
          defaultOpen={false}
          clickOutsideToClose={false}
          instructions="You are an AI assistant for ApplyFlow, a job application tracking system. Help users manage their job applications, answer questions about their application status, and provide guidance on job searching and application management."
          labels={{
            title: "ApplyFlow Assistant",
            initial:
              "Hi! How can I help you manage your job applications today?",
            placeholder: "Ask about your applications...",
          }}
        >
          <AppContent />
        </CopilotSidebar>
      </BrowserRouter>
    );
  }

  return <LandingPage />;
}

export default App;
