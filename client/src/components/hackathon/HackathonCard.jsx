import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Trophy, Wifi, WifiOff } from 'lucide-react';

const statusConfig = {
  'Draft': { cls: 'badge-gray', label: 'Draft' },
  'Registration Open': { cls: 'badge-green', label: 'Reg. Open' },
  'Registration Closed': { cls: 'badge-red', label: 'Reg. Closed' },
  'Ongoing': { cls: 'badge-purple', label: 'Ongoing' },
  'Completed': { cls: 'badge-blue', label: 'Completed' },
};

const HackathonCard = ({ hackathon }) => {
  const { _id, title, description, theme, mode, startDate, endDate, prizePool, maxTeamSize, bannerImage, status, organizer } = hackathon;
  const statusInfo = statusConfig[status] || statusConfig['Draft'];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const isOnline = mode === 'Online';

  return (
    <Link to={`/hackathons/${_id}`} className="block card-hover group">
      <div className="glass-card overflow-hidden h-full flex flex-col">
        {/* Banner */}
        <div className="relative h-44 bg-gradient-to-br from-purple-900/60 to-pink-900/40 overflow-hidden">
          {bannerImage ? (
            <img src={`http://localhost:5000${bannerImage}`} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy size={48} className="text-purple-400/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          {/* Status badge */}
          <span className={`absolute top-3 right-3 badge ${statusInfo.cls}`}>{statusInfo.label}</span>
          {/* Mode badge */}
          <span className={`absolute top-3 left-3 badge ${isOnline ? 'badge-purple' : 'badge-yellow'} flex items-center gap-1`}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {mode}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Theme */}
          <span className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-2">{theme}</span>

          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">{description}</p>

          {/* Meta */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={13} className="text-purple-400 flex-shrink-0" />
              <span>{start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={13} className="text-purple-400" />
                <span>Max {maxTeamSize} per team</span>
              </div>
              {prizePool && (
                <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                  <Trophy size={13} />
                  {prizePool}
                </div>
              )}
            </div>
          </div>

          {/* Organizer */}
          {organizer && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {organizer.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-gray-500 text-xs">by {organizer.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HackathonCard;
