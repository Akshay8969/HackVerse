import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, hackathonService, registrationService, userService } from '../../services';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { Plus, Zap, Users, FileText, Clock, CheckCircle, XCircle, ToggleLeft, ToggleRight, UserCheck, Edit, Trash2 } from 'lucide-react';

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

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [judges, setJudges] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', theme: '', mode: 'Online', startDate: '', endDate: '', registrationDeadline: '', prizePool: '', maxTeamSize: 4, rules: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      dashboardService.getOrganizer(),
      userService.getJudges(),
    ]).then(([dashRes, judgeRes]) => {
      setStats(dashRes.data);
      setJudges(judgeRes.data.judges);
    }).finally(() => setLoading(false));
  }, []);

  const fetchRegistrations = async (hackathonId) => {
    setRegLoading(true);
    try {
      const res = await registrationService.getForHackathon(hackathonId);
      setRegistrations(res.data.registrations);
    } finally {
      setRegLoading(false);
    }
  };

  const handleSelectHackathon = (h) => {
    setActiveHackathon(h);
    setSelectedJudges(h.judges?.map(j => j._id || j) || []);
    fetchRegistrations(h._id);
  };

  const handleUpdateRegStatus = async (regId, status) => {
    try {
      await registrationService.updateStatus(regId, status);
      setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, status } : r));
      toast.success(`Registration ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleToggleRegistration = async (h) => {
    try {
      await hackathonService.toggleRegistration(h._id);
      const updated = { ...h, registrationOpen: !h.registrationOpen };
      setActiveHackathon(updated);
      setStats(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(hk => hk._id === h._id ? updated : hk),
      }));
      toast.success(h.registrationOpen ? 'Registration closed' : 'Registration opened');
    } catch { toast.error('Failed'); }
  };

  const handleAssignJudges = async () => {
    try {
      await hackathonService.assignJudges(activeHackathon._id, selectedJudges);
      toast.success('Judges assigned successfully!');
    } catch { toast.error('Failed to assign judges'); }
  };

  const handleAnnounceWinners = async () => {
    if (!confirm('Announce winners? This cannot be undone.')) return;
    try {
      await hackathonService.announceWinners(activeHackathon._id);
      toast.success('Winners announced!');
      setActiveHackathon({ ...activeHackathon, winnersAnnounced: true, status: 'Completed' });
    } catch { toast.error('Failed'); }
  };

  const handleDeleteHackathon = async (id) => {
    if (!confirm('Delete this hackathon?')) return;
    try {
      await hackathonService.delete(id);
      setStats(prev => ({ ...prev, hackathons: prev.hackathons.filter(h => h._id !== id) }));
      if (activeHackathon?._id === id) setActiveHackathon(null);
      toast.success('Hackathon deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      await hackathonService.create(formData);
      toast.success('Hackathon created!');
      setShowCreateForm(false);
      setForm({ title: '', description: '', theme: '', mode: 'Online', startDate: '', endDate: '', registrationDeadline: '', prizePool: '', maxTeamSize: 4, rules: '' });
      const dashRes = await dashboardService.getOrganizer();
      setStats(dashRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create hackathon');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <MainLayout><Loader /></MainLayout>;

  const statusColors = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Organizer Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your hackathons</p>
          </div>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            <Plus size={16} /> New Hackathon
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-white font-bold mb-5">Create New Hackathon</h3>
            <form onSubmit={handleCreateHackathon} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="input-label">Title *</label><input required className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="sm:col-span-2"><label className="input-label">Description *</label><textarea required className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><label className="input-label">Theme *</label><input required className="input-field" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} /></div>
              <div><label className="input-label">Mode *</label>
                <select required className="input-field" value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} style={{background:'#1a1a2e'}}>
                  {['Online','Offline','Hybrid'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div><label className="input-label">Start Date *</label><input required type="datetime-local" className="input-field" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
              <div><label className="input-label">End Date *</label><input required type="datetime-local" className="input-field" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              <div><label className="input-label">Registration Deadline *</label><input required type="datetime-local" className="input-field" value={form.registrationDeadline} onChange={e => setForm({...form, registrationDeadline: e.target.value})} /></div>
              <div><label className="input-label">Max Team Size</label><input type="number" min={1} className="input-field" value={form.maxTeamSize} onChange={e => setForm({...form, maxTeamSize: e.target.value})} /></div>
              <div><label className="input-label">Prize Pool</label><input className="input-field" placeholder="₹50,000" value={form.prizePool} onChange={e => setForm({...form, prizePool: e.target.value})} /></div>
              <div className="sm:col-span-2"><label className="input-label">Rules</label><textarea className="input-field resize-none" rows={3} value={form.rules} onChange={e => setForm({...form, rules: e.target.value})} /></div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={creating} className="btn-primary">{creating ? 'Creating...' : 'Create Hackathon'}</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Zap} label="Hackathons" value={stats?.stats?.totalHackathons} color="from-purple-500 to-violet-600" />
          <StatCard icon={Users} label="Registrations" value={stats?.stats?.totalRegistrations} color="from-pink-500 to-rose-600" />
          <StatCard icon={Clock} label="Pending" value={stats?.stats?.pendingRegistrations} color="from-yellow-500 to-amber-600" />
          <StatCard icon={Users} label="Teams" value={stats?.stats?.totalTeams} color="from-cyan-500 to-blue-600" />
          <StatCard icon={FileText} label="Submissions" value={stats?.stats?.totalSubmissions} color="from-green-500 to-emerald-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hackathon list */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">My Hackathons</h2>
            </div>
            <div className="divide-y divide-white/5">
              {stats?.hackathons?.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No hackathons yet</div>
              ) : (
                stats?.hackathons?.map(h => (
                  <div key={h._id}
                    onClick={() => handleSelectHackathon(h)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${activeHackathon?._id === h._id ? 'bg-purple-500/10 border-l-2 border-purple-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{h.title}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{h.status}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteHackathon(h._id); }} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Management panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeHackathon ? (
              <>
                {/* Controls */}
                <div className="glass-card p-6">
                  <h3 className="text-white font-bold mb-4 truncate">{activeHackathon.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleToggleRegistration(activeHackathon)} className={`btn-secondary flex items-center gap-2 text-sm ${activeHackathon.registrationOpen ? 'border-red-500/30 text-red-400' : 'border-green-500/30 text-green-400'}`}>
                      {activeHackathon.registrationOpen ? <><ToggleRight size={16} /> Close Reg.</> : <><ToggleLeft size={16} /> Open Reg.</>}
                    </button>
                    {!activeHackathon.winnersAnnounced && (
                      <button onClick={handleAnnounceWinners} className="btn-primary text-sm">
                        🏆 Announce Winners
                      </button>
                    )}
                  </div>
                </div>

                {/* Judge assignment */}
                <div className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><UserCheck size={16} className="text-purple-400" /> Assign Judges</h3>
                  {judges.length === 0 ? (
                    <p className="text-gray-400 text-sm">No judges registered on the platform</p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {judges.map(j => (
                          <label key={j._id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg">
                            <input
                              type="checkbox"
                              checked={selectedJudges.includes(j._id)}
                              onChange={e => setSelectedJudges(prev => e.target.checked ? [...prev, j._id] : prev.filter(id => id !== j._id))}
                              className="accent-purple-500"
                            />
                            <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {j.name?.charAt(0)}
                            </div>
                            <span className="text-gray-300 text-sm">{j.name}</span>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleAssignJudges} className="btn-secondary text-sm">Save Judges</button>
                    </>
                  )}
                </div>

                {/* Registrations */}
                <div className="glass-card overflow-hidden">
                  <div className="p-5 border-b border-white/10">
                    <h3 className="text-white font-semibold">Registrations ({registrations.length})</h3>
                  </div>
                  {regLoading ? <Loader /> : (
                    <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                      {registrations.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No registrations yet</div>
                      ) : registrations.map(reg => (
                        <div key={reg._id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {reg.participant?.name?.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white text-sm">{reg.participant?.name}</div>
                              <div className="text-gray-500 text-xs">{reg.participant?.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${statusColors[reg.status]}`}>{reg.status}</span>
                            {reg.status === 'pending' && (
                              <>
                                <button onClick={() => handleUpdateRegStatus(reg._id, 'approved')} className="text-green-400 hover:text-green-300 p-1.5 bg-green-400/10 rounded-lg">
                                  <CheckCircle size={14} />
                                </button>
                                <button onClick={() => handleUpdateRegStatus(reg._id, 'rejected')} className="text-red-400 hover:text-red-300 p-1.5 bg-red-400/10 rounded-lg">
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="glass-card p-12 text-center">
                <Zap size={40} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Select a hackathon from the list to manage it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrganizerDashboard;
