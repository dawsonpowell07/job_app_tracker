import { Circle, GraduationCap } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import LoginButton from "../LoginButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Blue academic background blobs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] animate-blob-morph opacity-70">
        <div className="w-full h-full bg-gradient-to-br from-[#8da9c4]/40 via-[#134074]/30 to-transparent rounded-full blur-3xl animate-gentle-pulse" />
      </div>
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] animate-blob-morph opacity-60"
        style={{ animationDelay: "2s" }}
      >
        <div
          className="w-full h-full bg-gradient-to-tr from-[#134074]/40 via-[#5a8ab8]/30 to-transparent rounded-full blur-3xl animate-gentle-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] animate-blob-morph opacity-50"
        style={{ animationDelay: "4s" }}
      >
        <div
          className="w-full h-full bg-linear-to-br from-[#8da9c4]/35 via-[#134074]/25 to-transparent rounded-full blur-3xl animate-gentle-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div
        className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] animate-blob-morph opacity-55"
        style={{ animationDelay: "6s" }}
      >
        <div
          className="w-full h-full bg-linear-to-tr from-[#6b9ac8]/35 via-[#8da9c4]/25 to-transparent rounded-full blur-3xl animate-gentle-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>
      <div
        className="absolute top-2/3 left-1/3 w-[400px] h-[400px] animate-blob-morph opacity-60"
        style={{ animationDelay: "3s" }}
      >
        <div
          className="w-full h-full bg-linear-to-bl from-[#134074]/35 via-[#8da9c4]/25 to-transparent rounded-full blur-3xl animate-gentle-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-8 py-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-[#134074] animate-gentle-pulse" />
              <span className="text-2xl tracking-wide font-handwritten">
                ApplyFlow
              </span>
            </div>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal" redirectUrl="/">
                <button className="px-4 py-2 rounded-full border border-border/60 text-sm font-light hover:border-primary/60 transition-colors duration-300">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" redirectUrl="/">
                <button className="px-4 py-2 rounded-full bg-[#134074] text-white text-sm font-light hover:brightness-110 transition duration-300 watercolor-shadow-sm">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-8 pt-32 pb-48">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl animate-fade-in-up space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 border border-border/60 text-sm font-light backdrop-blur-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-[#134074]" />
                Built for intentional job seekers
              </div>
              <div className="mb-16 space-y-6">
                <h1 className="text-[5rem] md:text-[7rem] lg:text-[9rem] leading-[1.2]">
                  Job search,
                  <span
                    className="block italic bg-linear-to-r from-[#134074] via-[#5a8ab8] to-[#8da9c4] bg-clip-text text-transparent animate-shimmer"
                    style={{ backgroundSize: "200% auto" }}
                  >
                    reimagined
                  </span>
                </h1>
              </div>

              <div className="max-w-xl ml-auto space-y-12 animate-fade-in-up [animation-delay:200ms]">
                <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed">
                  An intelligent workspace for managing applications, versioning
                  resumes, and discovering insights through conversation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <LoginButton />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-card/60 px-4 py-4 backdrop-blur-sm space-y-2"
                    >
                      <div className="text-sm uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-2xl font-light text-foreground">
                        {item.value}
                      </div>
                      <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-8 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 lg:gap-32">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="space-y-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <Circle
                      className={`w-3 h-3 mt-2 ${feature.color}`}
                      fill="currentColor"
                    />
                    <div className="flex-1 space-y-4">
                      <h3 className="text-3xl md:text-4xl font-light tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-lg md:text-xl font-light text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="container mx-auto px-8 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-3 mb-14 animate-fade-in-up">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                Workflow
              </p>
              <h3 className="text-4xl md:text-5xl font-light leading-tight">
                A guided rhythm for your search
              </h3>
              <p className="text-lg text-muted-foreground font-light">
                Capture roles, tailor resumes, and move with clarity using a
                simple loop that keeps you in control.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-10">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-border/60 bg-card/70 p-8 space-y-4 backdrop-blur-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#134074]/80 to-[#8da9c4]/60 text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <h4 className="text-2xl font-light">{step.title}</h4>
                  </div>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#134074]/10 text-xs uppercase tracking-[0.12em] text-[#134074]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-8 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-12 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                Begin your journey
              </h2>
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for breathing room */}
        <div className="h-48" />

        {/* Footer */}
        <footer className="container mx-auto px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-border/60 pt-12">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#134074] animate-gentle-pulse" />
                <span className="text-xl tracking-wide font-handwritten text-muted-foreground">
                  ApplyFlow
                </span>
              </div>
              <p className="text-sm font-light text-muted-foreground">
                © 2025 — Designed with care
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Track everything",
    description:
      "A living record of every application. Status, timelines, and notes in a space that grows with your search.",
    color: "text-[#134074]",
  },
  {
    title: "Version your story",
    description:
      "Craft tailored resumes for every opportunity. Each version is saved, searchable, and ready when you need it.",
    color: "text-[#5a8ab8]",
  },
  {
    title: "Discover patterns",
    description:
      "AI agents analyze your applications to surface insights you might have missed. Learn what resonates.",
    color: "text-[#13315c]",
  },
  {
    title: "Converse naturally",
    description:
      "Ask questions, request feedback, explore your data. Your AI assistant understands context and remembers.",
    color: "text-[#8da9c4]",
  },
];

const highlights = [
  {
    label: "Clarity",
    value: "Stay on track",
    detail: "Statuses, owners, and next steps visible across every view.",
  },
  {
    label: "Focus",
    value: "Fewer tabs",
    detail: "Resumes, notes, and feedback live in the same workspace.",
  },
  {
    label: "Confidence",
    value: "Always prepared",
    detail: "Role-specific versions and reminders before every touchpoint.",
  },
  {
    label: "Momentum",
    value: "Small wins daily",
    detail: "Lightweight check-ins keep you shipping applications steadily.",
  },
];

const workflow = [
  {
    title: "Capture",
    description:
      "Save every opportunity with rich details, statuses, and due dates that stay in sync across views.",
    tags: ["intake", "status", "timeline"],
  },
  {
    title: "Tailor",
    description:
      "Spin up focused resume versions with guidance, attach to roles, and keep a clean version history.",
    tags: ["resumes", "feedback", "templates"],
  },
  {
    title: "Reflect",
    description:
      "Review trends, notes, and follow-ups so you always know what to do next and why it matters.",
    tags: ["insights", "actions", "focus"],
  },
];
