import { Link } from 'react-router-dom';
import { Zap, Users, Trophy, Code, ArrowRight, Star, Globe, Clock } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const stats = [
  { label: 'Hackathons Hosted', value: '200+', icon: Zap },
  { label: 'Participants', value: '50K+', icon: Users },
  { label: 'Projects Built', value: '12K+', icon: Code },
  { label: 'Prize Money', value: '$500K+', icon: Trophy },
];

const features = [
  {
    icon: Zap,
    title: 'Effortless Organization',
    desc: 'Create and manage hackathons with a powerful dashboard. Handle registrations, teams, and submissions in one place.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Build your dream team, invite members, assign roles, and collaborate seamlessly throughout the hackathon.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Trophy,
    title: 'Fair Evaluation',
    desc: 'Expert judges evaluate projects with structured criteria. Real-time leaderboards keep participants motivated.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Globe,
    title: 'Online & Offline',
    desc: 'Support for online, offline, and hybrid hackathons. Reach participants globally or host locally.',
    color: 'from-cyan-500 to-blue-600',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'First-time Hackathon Winner',
    text: 'HackVerse made it incredibly easy to find hackathons, form my team, and submit our project. We won our first hackathon!',
    avatar: 'P',
  },
  {
    name: 'Arjun Mehta',
    role: 'Hackathon Organizer',
    text: 'Managing 500+ participants used to be a nightmare. With HackVerse, everything from registration to judging is automated.',
    avatar: 'A',
  },
  {
    name: 'Sarah Chen',
    role: 'Judge & Mentor',
    text: 'The scoring system is intuitive and fair. I can review projects, give feedback, and see real-time results effortlessly.',
    avatar: 'S',
  },
];

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8 animate-fade-in-up">
              <Zap size={14} />
              The #1 Hackathon Management Platform
            </div>

            <h1
              className="font-['Outfit'] text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Build. Compete.{' '}
              <span className="gradient-text">Innovate.</span>
            </h1>

            <p
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              The all-in-one platform for organizing, managing, and participating in
              hackathons. Join thousands of developers, designers, and innovators.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link to="/hackathons" className="btn-primary text-base px-8 py-3.5">
                Explore Hackathons
                <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="btn-secondary text-base px-8 py-3.5">
                Get Started Free
              </Link>
            </div>

            {/* Floating cards */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass-card p-5 text-center card-hover">
                  <Icon className="mx-auto mb-2 text-purple-400" size={22} />
                  <div className="text-2xl font-bold text-white font-['Outfit']">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-4xl font-bold text-white mb-4">
              Everything You Need to Run a{' '}
              <span className="gradient-text">World-Class Hackathon</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From registration to result declaration, HackVerse handles every aspect of hackathon management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="glass-card p-6 card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-4xl font-bold text-white mb-4">
              Why Participate?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Code, title: 'Build Real Projects', desc: 'Work on meaningful projects that solve real-world problems in a time-boxed, focused environment.' },
              { icon: Users, title: 'Network & Collaborate', desc: 'Connect with talented developers, designers, and entrepreneurs from around the world.' },
              { icon: Trophy, title: 'Win & Grow', desc: 'Compete for prizes, gain recognition, and fast-track your career with hackathon wins on your resume.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
                  <item.icon size={26} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] text-4xl font-bold text-white mb-4">
              Loved by the <span className="gradient-text">Community</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-['Outfit'] text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers and start your hackathon journey today.
          </p>
          <Link to="/signup" className="btn-primary text-base px-10 py-4">
            Join HackVerse Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
