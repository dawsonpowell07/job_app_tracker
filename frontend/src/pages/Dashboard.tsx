import { FileText, LayoutGrid, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 gradient-mesh-1 opacity-30" />

      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-5xl tracking-tight">Welcome back</h1>
        <p className="text-lg font-light text-muted-foreground">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm p-6 watercolor-shadow-sm transition-all hover:watercolor-shadow hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.gradient}`} />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center watercolor-shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-50/80 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-light text-muted-foreground">{stat.title}</p>
                <p className="text-4xl tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-3xl tracking-tight">Recent Activity</h2>
        <div className="rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm overflow-hidden watercolor-shadow-sm">
          <div className="divide-y divide-border/40">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="p-5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${activity.dotColor} animate-gentle-pulse`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm font-light text-muted-foreground">{activity.company}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-light text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <h2 className="text-3xl tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm p-6 text-left watercolor-shadow-sm transition-all hover:watercolor-shadow hover:-translate-y-1"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${action.gradient}`} />
              <div className="relative space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${action.iconBg} flex items-center justify-center watercolor-shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm font-light text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const stats = [
  {
    title: "Total Applications",
    value: "42",
    icon: LayoutGrid,
    iconBg: "bg-rose-100/70",
    iconColor: "text-rose-500",
    gradient: "bg-gradient-to-br from-rose-100/50 via-pink-50/30 to-transparent",
    trend: "+12%",
  },
  {
    title: "Active",
    value: "18",
    icon: Clock,
    iconBg: "bg-purple-100/70",
    iconColor: "text-purple-500",
    gradient: "bg-gradient-to-br from-purple-100/50 via-violet-50/30 to-transparent",
    trend: "+8%",
  },
  {
    title: "Interviews",
    value: "5",
    icon: TrendingUp,
    iconBg: "bg-emerald-100/70",
    iconColor: "text-emerald-500",
    gradient: "bg-gradient-to-br from-emerald-100/50 via-teal-50/30 to-transparent",
    trend: "+2",
  },
  {
    title: "Resumes",
    value: "3",
    icon: FileText,
    iconBg: "bg-blue-100/70",
    iconColor: "text-blue-500",
    gradient: "bg-gradient-to-br from-blue-100/50 via-sky-50/30 to-transparent",
  },
];

const recentActivity = [
  {
    title: "Application submitted",
    company: "Google — Senior Product Designer",
    time: "2 hours ago",
    dotColor: "bg-rose-400",
  },
  {
    title: "Interview scheduled",
    company: "Meta — Design Lead",
    time: "5 hours ago",
    dotColor: "bg-purple-400",
  },
  {
    title: "Application viewed",
    company: "Apple — UX Designer",
    time: "1 day ago",
    dotColor: "bg-emerald-400",
  },
  {
    title: "Resume updated",
    company: "Design Portfolio v3",
    time: "2 days ago",
    dotColor: "bg-blue-400",
  },
];

const quickActions = [
  {
    title: "New Application",
    description: "Track a new job application",
    icon: LayoutGrid,
    iconBg: "bg-rose-100/70",
    iconColor: "text-rose-500",
    gradient: "bg-gradient-to-br from-rose-100/50 via-pink-50/30 to-transparent",
  },
  {
    title: "Upload Resume",
    description: "Add a new resume version",
    icon: FileText,
    iconBg: "bg-purple-100/70",
    iconColor: "text-purple-500",
    gradient: "bg-gradient-to-br from-purple-100/50 via-violet-50/30 to-transparent",
  },
  {
    title: "View Insights",
    description: "Analyze your progress",
    icon: TrendingUp,
    iconBg: "bg-emerald-100/70",
    iconColor: "text-emerald-500",
    gradient: "bg-gradient-to-br from-emerald-100/50 via-teal-50/30 to-transparent",
  },
];
