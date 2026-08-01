import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import { Zap, Users, FileText, CheckCircle, Calendar, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <div className="text-2xl font-extrabold text-white font-['Outfit']">{value ?? '—'}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  </div>
);

const ParticipantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getParticipant().then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <MainLayout><Loader /></MainLayout>;

  const statusColors = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };
  const submissionStatus = { pending: 'badge-gray', under_review: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="page-title mb-2">My Dashboard</h1>
        <p className="text-gray-400 mb-8">Track your hackathon journey</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={Zap} label="Registered Hackathons" value={data?.stats?.totalRegistrations} color="from-purple-500 to-violet-600" />
          <StatCard icon={Users} label="Teams Joined" value={data?.stats?.totalTeams} color="from-pink-500 to-rose-600" />
          <StatCard icon={FileText} label="Submissions Made" value={data?.stats?.totalSubmissions} color="from-cyan-500 to-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registrations */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-semibold">My Registrations</h2>
              <Link to="/hackathons" className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
                Browse more <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {data?.registrations?.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Zap size={32} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-sm">You haven't registered for any hackathons yet</p>
                  <Link to="/hackathons" className="btn-primary mt-4">Browse Hackathons</Link>
                </div>
              ) : data?.registrations?.map(reg => (
                <div key={reg._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Link to={`/hackathons/${reg.hackathon?._id}`} className="text-white font-medium text-sm hover:text-purple-300 transition-colors line-clamp-1">
                        {reg.hackathon?.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(reg.hackathon?.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 text-xs">{reg.hackathon?.mode}</span>
                      </div>
                    </div>
                    <span className={`badge ${statusColors[reg.status]} flex-shrink-0`}>{reg.status}</span>
                  </div>
                  {reg.status === 'approved' && (
                    <div className="mt-3 flex gap-2">
                      <Link to={`/team/${reg.hackathon?._id}`} className="text-xs btn-secondary py-1.5 px-3">
                        <Users size={12} /> Team
                      </Link>
                      <Link to={`/submit/${reg.hackathon?._id}`} className="text-xs btn-secondary py-1.5 px-3">
                        <FileText size={12} /> Submit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submissions */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">My Submissions</h2>
            </div>
            <div className="divide-y divide-white/5">
              {data?.submissions?.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <FileText size={32} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-sm">No projects submitted yet</p>
                </div>
              ) : data?.submissions?.map(sub => (
                <div key={sub._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm line-clamp-1">{sub.projectName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{sub.hackathon?.title}</div>
                      {sub.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sub.techStack.slice(0, 3).map(t => (
                            <span key={t} className="text-[10px] bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`badge ${submissionStatus[sub.status]} flex-shrink-0`}>
                      {sub.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParticipantDashboard;
