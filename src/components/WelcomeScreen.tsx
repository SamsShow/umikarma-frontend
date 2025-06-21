import React from 'react';
import { 
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon, 
  CodeBracketIcon, 
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface WelcomeScreenProps {
  onConnect: () => void;
  loading: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onConnect, loading }) => {
  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-karma-700" />,
      title: "Sybil Resistant",
      description: "Advanced algorithms prevent gaming and ensure authentic reputation scores across all platforms. Multi-layer verification including wallet age, transaction patterns, and social proof."
    },
    {
      icon: <CodeBracketIcon className="h-8 w-8 text-karma-700" />,
      title: "Multi-Platform",
      description: "GitHub contributions, DAO participation, forum activity, and social engagement aggregated into one unified score. Support for 50+ platforms and growing."
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-karma-700" />,
      title: "AI-Powered",
      description: "GPT-4 models analyze and intelligently summarize your contributions with context and impact. Advanced NLP processes code quality, collaboration patterns, and community value."
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-karma-700" />,
      title: "DAO Ready",
      description: "Seamless integration for governance, task gating, and community reward allocation. Pre-built modules for Snapshot, Aragon, and custom governance systems."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-karma-700" />,
      title: "Transparent",
      description: "Clear breakdown and methodology showing exactly how your reputation score is calculated. Open-source algorithms with detailed documentation and audit trails."
    },
    {
      icon: <StarIcon className="h-8 w-8 text-karma-700" />,
      title: "Exportable",
      description: "Generate verifiable reputation certificates and proofs for any platform or community. Zero-knowledge proofs maintain privacy while proving reputation thresholds."
    }
  ];

  const useCases = [
    {
      title: "DAO Governance",
      description: "Gate proposal creation and voting power based on verified contribution history",
      details: "Prevent governance attacks and ensure decisions are made by proven contributors"
    },
    {
      title: "Grant Distribution",
      description: "Allocate funding based on objective contribution metrics and community impact",
      details: "Reduce bias in grant processes with data-driven reputation scoring"
    },
    {
      title: "Community Access",
      description: "Control access to exclusive channels, events, and resources based on karma scores",
      details: "Build high-quality communities by filtering members based on proven value"
    },
    {
      title: "Task Assignment",
      description: "Match contributors to tasks based on their expertise and reputation in specific domains",
      details: "Improve project outcomes by leveraging historical contribution data"
    }
  ];

  const technicalFeatures = [
    {
      title: "Cross-Chain Identity",
      description: "Unified identity across Ethereum, Polygon, Arbitrum, and 20+ networks",
      icon: "🌐"
    },
    {
      title: "Real-time Updates",
      description: "Live karma score updates via webhooks and GraphQL subscriptions",
      icon: "⚡"
    },
    {
      title: "Privacy Controls",
      description: "Granular privacy settings with selective disclosure capabilities",
      icon: "🔒"
    },
    {
      title: "API Integration",
      description: "RESTful and GraphQL APIs with comprehensive SDK support",
      icon: "🔧"
    }
  ];

  const integrations = [
    { name: 'GitHub', logo: '🐙' },
    { name: 'Snapshot', logo: '📸' },
    { name: 'Discord', logo: '💬' },
    { name: 'Lens', logo: '🌿' },
    { name: 'Umi', logo: '🔷' },
    { name: 'Chainlink', logo: '🔗' },
    { name: 'OpenAI', logo: '🤖' },
    { name: 'Farcaster', logo: '📡' },
  ];

  const benefits = [
    "Aggregate cross-platform contributions",
    "AI-powered impact analysis", 
    "Sybil-resistant verification",
    "DAO governance integration"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-karma-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-karma-900 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-karma-900">UmiKarma</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#integrations" className="nav-link">Integrations</a>
              <a href="#docs" className="nav-link">Docs</a>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="nav-link">Sign in</button>
              <button 
                onClick={onConnect}
                disabled={loading}
                className="btn-primary"
              >
                Connect to Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-smooth-gradient-2 border border-primary-100/50 text-karma-700 text-sm font-medium shadow-soft backdrop-blur-sm">
                🚀 Now live on Umi Network
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-karma-900 mb-6 leading-tight">
              Build reputation with{' '}
              <span className="text-gradient">UmiKarma</span>
            </h1>
            
            <p className="text-xl text-karma-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-enhanced reputation system that aggregates your contributions across GitHub, 
              DAOs, and forums into a unified, Sybil-resistant karma score.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={onConnect}
                disabled={loading}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Building Reputation
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center space-x-2">
                  <CheckIcon className="h-5 w-5 text-accent-500" />
                  <span className="text-karma-600 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section-padding bg-karma-50/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              All-in-One Lens
            </h2>
            <p className="text-xl text-karma-600 max-w-2xl mx-auto">
              Everything you need to build, track, and leverage your reputation in the decentralized world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const gradientClasses = [
                'gradient-card',
                'gradient-card-blue', 
                'gradient-card-green',
                'gradient-card-yellow',
                'gradient-card-pink',
                'gradient-card-mixed'
              ];
              return (
                <div key={index} className={`${gradientClasses[index]} text-center group`}>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white/80 rounded-2xl group-hover:bg-white/90 transition-all duration-300 shadow-soft backdrop-blur-sm">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-karma-900 mb-3">{feature.title}</h3>
                  <p className="text-karma-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Powering the Future of Web3 Communities
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              From DAO governance to grant distribution, UmiKarma enables fair and transparent community management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="gradient-card-blue">
                <h3 className="text-xl font-semibold text-karma-900 mb-3">{useCase.title}</h3>
                <p className="text-karma-700 mb-4 font-medium">{useCase.description}</p>
                <p className="text-karma-600 text-sm">{useCase.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="section-padding bg-karma-50/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Built for Developers
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              Comprehensive APIs, SDKs, and documentation to integrate reputation systems into any application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="gradient-card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-karma-900 mb-2">{feature.title}</h3>
                <p className="text-karma-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Blockchain Ecosystem
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              We're working together with leading protocols to build social and financial rails for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {integrations.map((integration, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="text-4xl">{integration.logo}</div>
                <span className="text-sm font-medium text-karma-600">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-karma-50/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="gradient-card animate-slide-up">
              <div className="text-4xl lg:text-5xl font-bold text-karma-900 mb-2">1,247+</div>
              <div className="text-karma-600 font-medium">Contributors Scored</div>
            </div>
            <div className="gradient-card-blue animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-karma-900 mb-2">23,891+</div>
              <div className="text-karma-600 font-medium">Contributions Analyzed</div>
            </div>
            <div className="gradient-card-green animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-karma-900 mb-2">156+</div>
              <div className="text-karma-600 font-medium">DAOs Integrated</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Developer-First API
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              Integrate UmiKarma into your application with our comprehensive RESTful and GraphQL APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-karma-900 mb-6">Quick Integration</h3>
              <div className="space-y-4">
                <div className="gradient-card-green">
                  <h4 className="font-semibold text-karma-900 mb-2">1. Install SDK</h4>
                  <code className="text-sm text-karma-600 font-mono">npm install @umikarma/sdk</code>
                </div>
                <div className="gradient-card-blue">
                  <h4 className="font-semibold text-karma-900 mb-2">2. Initialize Client</h4>
                  <code className="text-sm text-karma-600 font-mono">const karma = new UmiKarma(apiKey)</code>
                </div>
                <div className="gradient-card-yellow">
                  <h4 className="font-semibold text-karma-900 mb-2">3. Get Reputation</h4>
                  <code className="text-sm text-karma-600 font-mono">await karma.getScore(wallet)</code>
                </div>
              </div>
            </div>
            <div className="gradient-card">
              <h4 className="font-semibold text-karma-900 mb-4">Example Response</h4>
              <pre className="text-sm text-karma-600 font-mono overflow-x-auto">
{`{
  "wallet": "0x742d35Cc...",
  "karmaScore": 87,
  "trustFactor": 0.94,
  "breakdown": {
    "github": 45,
    "dao": 28,
    "forum": 14
  },
  "verifications": [
    "wallet_age",
    "github_verified",
    "poap_holder"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-karma-50/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no vendor lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gradient-card text-center">
              <h3 className="text-xl font-semibold text-karma-900 mb-4">Starter</h3>
              <div className="text-3xl font-bold text-karma-900 mb-2">Free</div>
              <p className="text-karma-600 mb-6">Perfect for testing and small projects</p>
              <ul className="text-sm text-karma-600 space-y-2 mb-6">
                <li>• 1,000 API calls/month</li>
                <li>• Basic reputation scoring</li>
                <li>• Community support</li>
                <li>• Documentation access</li>
              </ul>
              <button className="btn-secondary w-full">Get Started Free</button>
            </div>
            
            <div className="gradient-card-blue text-center border-2 border-primary-300">
              <div className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-karma-900 mb-4">Pro</h3>
              <div className="text-3xl font-bold text-karma-900 mb-2">$99<span className="text-lg font-normal">/mo</span></div>
              <p className="text-karma-600 mb-6">For growing applications and DAOs</p>
              <ul className="text-sm text-karma-600 space-y-2 mb-6">
                <li>• 100,000 API calls/month</li>
                <li>• Advanced AI analysis</li>
                <li>• Priority support</li>
                <li>• Custom integrations</li>
                <li>• Analytics dashboard</li>
              </ul>
              <button className="btn-primary w-full">Start Pro Trial</button>
            </div>
            
            <div className="gradient-card text-center">
              <h3 className="text-xl font-semibold text-karma-900 mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-karma-900 mb-2">Custom</div>
              <p className="text-karma-600 mb-6">For large organizations and protocols</p>
              <ul className="text-sm text-karma-600 space-y-2 mb-6">
                <li>• Unlimited API calls</li>
                <li>• Custom algorithms</li>
                <li>• Dedicated support</li>
                <li>• On-premise deployment</li>
                <li>• SLA guarantees</li>
              </ul>
              <button className="btn-secondary w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Links Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Comprehensive Documentation
            </h2>
            <p className="text-xl text-karma-600 max-w-3xl mx-auto">
              Everything you need to integrate, customize, and scale your reputation system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="gradient-card-green">
              <h3 className="font-semibold text-karma-900 mb-3">Quick Start Guide</h3>
              <p className="text-karma-600 mb-4">Get up and running in under 10 minutes with our step-by-step tutorial.</p>
              <a href="#" className="text-accent-600 font-medium hover:text-accent-700">Start Tutorial →</a>
            </div>
            
            <div className="gradient-card-blue">
              <h3 className="font-semibold text-karma-900 mb-3">API Reference</h3>
              <p className="text-karma-600 mb-4">Complete API documentation with examples and interactive playground.</p>
              <a href="#" className="text-primary-600 font-medium hover:text-primary-700">View Docs →</a>
            </div>
            
            <div className="gradient-card-yellow">
              <h3 className="font-semibold text-karma-900 mb-3">SDK Libraries</h3>
              <p className="text-karma-600 mb-4">Official SDKs for JavaScript, Python, Rust, and more coming soon.</p>
              <a href="#" className="text-yellow-600 font-medium hover:text-yellow-700">Download SDKs →</a>
            </div>
            
            <div className="gradient-card-pink">
              <h3 className="font-semibold text-karma-900 mb-3">Integration Examples</h3>
              <p className="text-karma-600 mb-4">Real-world examples of UmiKarma integration in popular frameworks.</p>
              <a href="#" className="text-pink-600 font-medium hover:text-pink-700">View Examples →</a>
            </div>
            
            <div className="gradient-card-mixed">
              <h3 className="font-semibold text-karma-900 mb-3">Algorithm Details</h3>
              <p className="text-karma-600 mb-4">Deep dive into our reputation algorithms and scoring methodology.</p>
              <a href="#" className="text-primary-600 font-medium hover:text-primary-700">Learn More →</a>
            </div>
            
            <div className="gradient-card">
              <h3 className="font-semibold text-karma-900 mb-3">Community Forum</h3>
              <p className="text-karma-600 mb-4">Connect with other developers and get help from our community.</p>
              <a href="#" className="text-karma-600 font-medium hover:text-karma-700">Join Discussion →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="gradient-card-mixed text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-karma-900 mb-4">
              Ready to Build the Future of Reputation?
            </h2>
            <p className="text-xl text-karma-600 mb-8">
              Join thousands of developers building the next generation of decentralized applications with UmiKarma.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onConnect}
                disabled={loading}
                className="btn-primary text-lg px-8 py-4"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Start Building Now'
                )}
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Explore Documentation
              </button>
            </div>
            <p className="text-sm text-karma-500 mt-4">
              No credit card required • Free tier available • Open source
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-karma-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-karma-900 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-karma-900">UmiKarma</span>
            </div>
            
            <div className="text-karma-600 text-sm">
              Built with ❤️ for a more trustworthy decentralized future
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen; 