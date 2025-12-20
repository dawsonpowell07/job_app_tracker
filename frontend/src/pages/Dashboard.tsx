import { FileText, LayoutGrid, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-light tracking-tight">Welcome back</h1>
        <p className="text-lg font-light text-gray-500">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-black/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm shadow-gray-200/50 transition-all hover:shadow-lg hover:shadow-gray-300/50 hover:border-black/70 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.gradient}`} />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs font-light text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-light text-gray-600">{stat.title}</p>
                <p className="text-3xl font-light tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-2xl font-light tracking-tight">Recent Activity</h2>
        <div className="rounded-2xl border border-black/50 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm shadow-gray-200/50">
          <div className="divide-y divide-black/20">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-60/90 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.dotColor}`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-light text-gray-900">{activity.title}</p>
                    <p className="text-sm font-light text-gray-500">{activity.company}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-light text-gray-500">
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
        <h2 className="text-2xl font-light tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="group relative overflow-hidden rounded-2xl border border-black/50 bg-white/80 backdrop-blur-sm p-6 text-left shadow-sm shadow-gray-200/50 transition-all hover:shadow-lg hover:shadow-gray-300/50 hover:border-black/70"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${action.gradient}`} />
              <div className="relative space-y-3">
                <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="font-light text-gray-900">{action.title}</p>
                  <p className="text-sm font-light text-gray-500">{action.description}</p>
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
    iconBg: "bg-pink-100/50",
    iconColor: "text-pink-500",
    gradient: "bg-gradient-to-br from-pink-50/30 to-transparent",
    trend: "+12%",
  },
  {
    title: "Active",
    value: "18",
    icon: Clock,
    iconBg: "bg-purple-100/50",
    iconColor: "text-purple-500",
    gradient: "bg-gradient-to-br from-purple-50/30 to-transparent",
    trend: "+8%",
  },
  {
    title: "Interviews",
    value: "5",
    icon: TrendingUp,
    iconBg: "bg-blue-100/50",
    iconColor: "text-blue-500",
    gradient: "bg-gradient-to-br from-blue-50/30 to-transparent",
    trend: "+2",
  },
  {
    title: "Resumes",
    value: "3",
    icon: FileText,
    iconBg: "bg-cyan-100/50",
    iconColor: "text-cyan-500",
    gradient: "bg-gradient-to-br from-cyan-50/30 to-transparent",
  },
];

const recentActivity = [
  {
    title: "Application submitted",
    company: "Google — Senior Product Designer",
    time: "2 hours ago",
    dotColor: "bg-pink-400",
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
    dotColor: "bg-blue-400",
  },
  {
    title: "Resume updated",
    company: "Design Portfolio v3",
    time: "2 days ago",
    dotColor: "bg-cyan-400",
  },
];

const quickActions = [
  {
    title: "New Application",
    description: "Track a new job application",
    icon: LayoutGrid,
    iconBg: "bg-pink-100/50",
    iconColor: "text-pink-500",
    gradient: "bg-gradient-to-br from-pink-50/30 to-transparent",
  },
  {
    title: "Upload Resume",
    description: "Add a new resume version",
    icon: FileText,
    iconBg: "bg-purple-100/50",
    iconColor: "text-purple-500",
    gradient: "bg-gradient-to-br from-purple-50/30 to-transparent",
  },
  {
    title: "View Insights",
    description: "Analyze your progress",
    icon: TrendingUp,
    iconBg: "bg-blue-100/50",
    iconColor: "text-blue-500",
    gradient: "bg-gradient-to-br from-blue-50/30 to-transparent",
  },
];
