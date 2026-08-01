import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { Users, Zap, Layers, FileText, ShieldOff, Shield, Trash2, UserCog } from 'lucide-react';

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    dashboardService.getAdmin().then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setUsersLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      userService.getAllUsers(params)
        .then(res => setUsers(res.data.users))
        .finally(() => setUsersLoading(false));
    }, 400);
    return () => clearTimeout(t);
  }, [search, roleFilter]);

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await userService.toggleBlock(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const roleColors = { admin: 'badge-red', organizer: 'badge-blue', participant: 'badge-green', judge: 'badge-yellow' };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and user management</p>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard icon={Users} label="Total Users" value={stats?.stats?.totalUsers} color="from-purple-500 to-violet-600" />
              <StatCard icon={Zap} label="Hackathons" value={stats?.stats?.totalHackathons} color="from-pink-500 to-rose-600" />
              <StatCard icon={Layers} label="Teams" value={stats?.stats?.totalTeams} color="from-cyan-500 to-blue-600" />
              <StatCard icon={FileText} label="Submissions" value={stats?.stats?.totalSubmissions} color="from-amber-500 to-orange-600" />
            </div>

            {/* Users by role */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {stats?.usersByRole?.map(r => (
                <div key={r._id} className="glass-card p-4 text-center">
                  <div className="text-xl font-bold text-white">{r.count}</div>
                  <div className={`badge ${roleColors[r._id] || 'badge-gray'} mt-1`}>{r._id}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* User Management */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2"><UserCog size={18} className="text-purple-400" /> User Management</h2>
            <div className="flex gap-3 flex-wrap">
              <input
                className="input-field w-52"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="input-field w-36" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ background: '#1a1a2e' }}>
                <option value="">All Roles</option>
                {['admin', 'organizer', 'participant', 'judge'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {usersLoading ? <Loader /> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3 text-gray-400 text-xs uppercase">User</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs uppercase">Joined</th>
                    <th className="text-right px-6 py-3 text-gray-400 text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{u.name}</div>
                            <div className="text-gray-500 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`badge ${roleColors[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                      <td className="px-6 py-4">
                        <span className={`badge ${u.isBlocked ? 'badge-red' : 'badge-green'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {u._id !== user?._id && (
                            <>
                              <button
                                onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${u.isBlocked ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'}`}
                              >
                                {u.isBlocked ? <><Shield size={12} /> Unblock</> : <><ShieldOff size={12} /> Block</>}
                              </button>
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12 text-gray-400">No users found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
