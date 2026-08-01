import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hackathonService, registrationService } from '../services';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import {
  Calendar, MapPin, Users, Trophy, Clock, Globe, Wifi, WifiOff,
  BookOpen, Award, ArrowLeft, UserPlus, UserMinus, ExternalLink
} from 'lucide-react';

const HackathonDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await hackathonService.getById(id);
        setHackathon(res.data.hackathon);

        if (isAuthenticated && user?.role === 'participant') {
          const regRes = await registrationService.check(id);
          setRegistration(regRes.data.registration);
        }
      } catch {
        toast.error('Hackathon not found');
        navigate('/hackathons');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setRegLoading(true);
    try {
      const res = await registrationService.register(id);
      setRegistration(res.data.registration);
      toast.success('Registered successfully! Waiting for approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleCancelReg = async () => {
    if (!registration) return;
    setRegLoading(true);
    try {
      await registrationService.cancel(registration._id);
      setRegistration(null);
      toast.success('Registration cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return <MainLayout><Loader text="Loading hackathon..." /></MainLayout>;
  if (!hackathon) return null;

  const { title, description, theme, mode, venue, startDate, endDate, registrationDeadline,
    prizePool, maxTeamSize, rules, judgingCriteria, organizer, judges, status,
    registrationOpen, bannerImage, winnersAnnounced } = hackathon;

  const regStatusColors = {
    pending: 'badge-yellow',
    approved: 'badge-green',
    rejected: 'badge-red',
  };

  return (
    <MainLayout>
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {bannerImage ? (
          <img src={`http://localhost:5000${bannerImage}`} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center">
            <Trophy size={80} className="text-purple-400/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-6 left-4 right-4 max-w-5xl mx-auto">
          <Link to="/hackathons" className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white text-sm mb-4 group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Hackathons
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className={`badge ${mode === 'Online' ? 'badge-purple' : 'badge-yellow'} flex items-center gap-1`}>
              {mode === 'Online' ? <Wifi size={10} /> : <WifiOff size={10} />} {mode}
            </span>
            <span className="badge badge-gray">{status}</span>
            {winnersAnnounced && <span className="badge badge-yellow flex items-center gap-1"><Trophy size={10} /> Winners Announced</span>}
          </div>
          <h1 className="font-['Outfit'] text-3xl md:text-4xl font-extrabold text-white leading-tight">{title}</h1>
          <p className="text-purple-300 font-medium mt-1">{theme}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={18} className="text-purple-400" /> About this Hackathon</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>

            {/* Rules */}
            {rules && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-lg mb-4">📋 Rules & Guidelines</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{rules}</p>
              </div>
            )}

            {/* Judging Criteria */}
            {judgingCriteria?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Award size={18} className="text-purple-400" /> Judging Criteria</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {judgingCriteria.map((c, i) => (
                    <div key={i} className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                      <div className="text-purple-300 font-semibold text-sm">{c.name}</div>
                      <div className="text-gray-400 text-xs mt-1">Max {c.maxScore} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Judges */}
            {judges?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-lg mb-4">👨‍⚖️ Judges</h2>
                <div className="flex flex-wrap gap-3">
                  {judges.map((j) => (
                    <div key={j._id} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                      <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {j.name?.charAt(0)}
                      </div>
                      <span className="text-gray-300 text-sm">{j.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Registration action */}
            <div className="glass-card p-6">
              {user?.role === 'participant' ? (
                registration ? (
                  <>
                    <div className="text-center mb-4">
                      <span className={`badge ${regStatusColors[registration.status] || 'badge-gray'} text-sm px-4 py-2`}>
                        Registration: {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </div>
                    {registration.status === 'approved' && (
                      <Link to={`/team/${id}`} className="btn-primary w-full justify-center mb-3">
                        <Users size={15} /> Manage Team
                      </Link>
                    )}
                    <button onClick={handleCancelReg} disabled={regLoading} className="btn-danger w-full justify-center">
                      <UserMinus size={15} />
                      {regLoading ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={regLoading || !registrationOpen}
                    className="btn-primary w-full justify-center py-3"
                  >
                    <UserPlus size={15} />
                    {regLoading ? 'Registering...' : registrationOpen ? 'Register Now' : 'Registration Closed'}
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn-primary w-full justify-center py-3">
                  Login to Register
                </Link>
              ) : (
                <div className="text-center text-gray-400 text-sm py-2">
                  {user?.role === 'organizer' && user?._id === hackathon.organizer?._id ? (
                    <Link to={`/dashboard/organizer`} className="btn-secondary w-full justify-center">
                      Manage Hackathon
                    </Link>
                  ) : (
                    <span>View as {user?.role}</span>
                  )}
                </div>
              )}
            </div>

            {/* Details card */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-semibold">Event Details</h3>
              {[
                { icon: Calendar, label: 'Start Date', value: new Date(startDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                { icon: Calendar, label: 'End Date', value: new Date(endDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                { icon: Clock, label: 'Reg. Deadline', value: new Date(registrationDeadline).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                { icon: Users, label: 'Max Team Size', value: `${maxTeamSize} members` },
                { icon: Trophy, label: 'Prize Pool', value: prizePool || 'TBD' },
                ...(venue ? [{ icon: MapPin, label: 'Venue', value: venue }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={15} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-500 text-xs">{label}</div>
                    <div className="text-gray-200 text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Organizer */}
            {organizer && (
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-3 text-sm">Organized by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {organizer.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{organizer.name}</div>
                    <div className="text-gray-500 text-xs">{organizer.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard link if completed */}
            {winnersAnnounced && (
              <Link to={`/leaderboard`} state={{ hackathonId: id }} className="btn-primary w-full justify-center">
                <Trophy size={15} /> View Leaderboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HackathonDetails;
