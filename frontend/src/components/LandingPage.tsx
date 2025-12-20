import { ArrowRight, Circle } from 'lucide-react';
import LoginButton from '../LoginButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fefefe] text-[#1a1a1a] overflow-hidden relative">
      {/* Soft pastel background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-yellow-200/20 via-orange-200/15 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-8 py-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full" />
              <span className="text-lg font-light tracking-wide">ApplyFlow</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-8 pt-32 pb-48">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-16 space-y-6">
                <h1 className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-light leading-[0.9] tracking-tight">
                  Job search,
                  <span className="block italic font-extralight bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                    reimagined
                  </span>
                </h1>
              </div>

              <div className="max-w-xl ml-auto space-y-12 animate-fade-in-up [animation-delay:200ms]">
                <p className="text-xl md:text-2xl font-light text-gray-600 leading-relaxed">
                  An intelligent workspace for managing applications, versioning resumes,
                  and discovering insights through conversation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <LoginButton />
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
                    <Circle className={`w-3 h-3 mt-2 ${feature.color}`} fill="currentColor" />
                    <div className="flex-1 space-y-4">
                      <h3 className="text-3xl md:text-4xl font-light tracking-tight">{feature.title}</h3>
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

        {/* Spacer for breathing room */}
        <div className="h-32" />

        {/* CTA Section */}
        <section className="container mx-auto px-8 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-12 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                Begin your journey
              </h2>
              <LoginButton />
            </div>
          </div>
        </section>

        {/* Spacer for breathing room */}
        <div className="h-48" />

        {/* Footer */}
        <footer className="container mx-auto px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-gray-200 pt-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full" />
                <span className="text-sm font-light tracking-wide text-gray-500">ApplyFlow</span>
              </div>
              <p className="text-sm font-light text-gray-400">
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
    title: 'Track everything',
    description: 'A living record of every application. Status, timelines, and notes in a space that grows with your search.',
    color: 'text-pink-300',
  },
  {
    title: 'Version your story',
    description: 'Craft tailored resumes for every opportunity. Each version is saved, searchable, and ready when you need it.',
    color: 'text-purple-300',
  },
  {
    title: 'Discover patterns',
    description: 'AI agents analyze your applications to surface insights you might have missed. Learn what resonates.',
    color: 'text-blue-300',
  },
  {
    title: 'Converse naturally',
    description: 'Ask questions, request feedback, explore your data. Your AI assistant understands context and remembers.',
    color: 'text-cyan-300',
  },
];
