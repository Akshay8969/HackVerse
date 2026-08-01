import { Link } from 'react-router-dom';
import { Zap, GitBranch, Globe, Link2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HackVerse
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The all-in-one platform for organizing, managing, and participating in hackathons. 
              Build, collaborate, and innovate.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: 'Browse Hackathons', path: '/hackathons' },
                { label: 'Leaderboard', path: '/leaderboard' },
                { label: 'Login', path: '/login' },
                { label: 'Sign Up', path: '/signup' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: GitBranch, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Link2, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} HackVerse. Built with ❤️ for the hacker community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
