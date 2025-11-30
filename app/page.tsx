'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Download, Heart, Zap, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl sm:text-7xl font-bold mb-6">
                The{' '}
                <span className="text-gradient">Spec</span>
                {' '}is the Product
              </h1>
              <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Stop blindly generating code. Start with battle-tested MD/JSON specifications.
                Browse hundreds of specs, or generate new ones with AI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/feed" className="btn-primary text-lg">
                  Browse Specs <Sparkles className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/writer" className="btn-secondary text-lg">
                  Generate with AI <Zap className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* Floating Cherry */}
            <motion.div
              className="absolute top-20 right-20 text-8xl opacity-20"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              🍒
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Why VibeCherry? <span className="text-cherry-400">🍒</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-cherry-400" />}
              title="Hundreds of Specs"
              description="Battle-tested specifications for landing pages, SaaS dashboards, API docs, and more. All free to download."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-cherry-400" />}
              title="AI-Powered Generator"
              description="The Writer uses DeepSeek to generate custom specs. Just describe what you're building and get a complete specification."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-cherry-400" />}
              title="Instant Downloads"
              description="Copy-paste ready MD and JSON files. No account needed to download. Use with any AI code generator."
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-cherry-400" />}
              title="Community Driven"
              description="Upvote the best specs, see what's popular, and share your own. Build collections of your favorites."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-cherry-400" />}
              title="Visual Previews"
              description="See screenshots of what each spec builds. Filter by difficulty, vibe, and technology stack."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-cherry-400" />}
              title="Your Spec Library"
              description="Save specs to collections, track your downloads, and build your personal library of patterns."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <Step
              number={1}
              title="Browse or Generate"
              description="Find a spec that matches your needs, or use The Writer to generate a custom one with AI."
            />
            <Step
              number={2}
              title="Download the Spec"
              description="Get the MD or JSON file. It's free, no strings attached. Copy and paste ready."
            />
            <Step
              number={3}
              title="Build Anything"
              description="Use your favorite AI code generator (Claude, ChatGPT, etc.) to build from the spec. The hard part is already done."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cherry-900/20 to-dark-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to build better?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers using specs to accelerate their projects.
          </p>
          <Link href="/signup" className="btn-primary text-lg">
            Start Building <span className="ml-2">🍒</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">🍒</span>
              <span className="text-gray-400">Made with 🍒 and an insane amount of code</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-cherry-400">
                About
              </Link>
              <Link href="/docs" className="text-gray-400 hover:text-cherry-400">
                Docs
              </Link>
              <Link href="/api" className="text-gray-400 hover:text-cherry-400">
                API
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            The sweetest specs on the web © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="card hover:border-cherry-500/50 transition-colors duration-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cherry-500/10 border-2 border-cherry-500 text-2xl font-bold text-cherry-400 mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
