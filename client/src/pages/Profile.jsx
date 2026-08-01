import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { User, Mail, GitBranch, Link2, Lock, Save, Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
  });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'skills') {
          // Convert comma-separated skills to array
          const skillsArr = v.split(',').map(s => s.trim()).filter(Boolean);
          skillsArr.forEach(skill => data.append('skills[]', skill));
        } else {
          data.append(k, v);
        }
      });
      const res = await authService.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPassLoading(true);
    try {
      await authService.changePassword(passForm);
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const roleColors = {
    admin: 'from-red-500 to-orange-500',
    organizer: 'from-blue-500 to-cyan-500',
    participant: 'from-green-500 to-emerald-500',
    judge: 'from-yellow-500 to-amber-500',
  };

  return (
    <MainLayout>
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <h1 className="page-title mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Avatar card */}
          <div className="glass-card p-6 text-center h-fit">
            <div className="relative inline-block mb-4">
              <div className={`w-24 h-24 bg-gradient-to-br ${roleColors[user?.role] || 'from-purple-500 to-pink-500'} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto`}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
                <Camera size={14} className="text-white" />
              </button>
            </div>
            <h2 className="text-white font-bold text-lg">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`mt-3 inline-block badge ${
              user?.role === 'admin' ? 'badge-red' :
              user?.role === 'organizer' ? 'badge-blue' :
              user?.role === 'judge' ? 'badge-yellow' : 'badge-green'
            }`}>
              {user?.role}
            </span>
            {user?.bio && <p className="text-gray-400 text-sm mt-4 leading-relaxed">{user.bio}</p>}
            {user?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {user.skills.map(skill => (
                  <span key={skill} className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right - Edit forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile form */}
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <User size={18} className="text-purple-400" />
                Edit Profile
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Full Name</label>
                    <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Skills (comma separated)</label>
                    <input className="input-field" placeholder="React, Node.js, Python..." value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Bio</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label flex items-center gap-1"><GitBranch size={12} /> GitHub</label>
                    <input className="input-field" placeholder="https://github.com/..." value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label flex items-center gap-1"><Link2 size={12} /> LinkedIn</label>
                    <input className="input-field" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  <Save size={15} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Password form */}
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <Lock size={18} className="text-purple-400" />
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" value={passForm.currentPassword} onChange={e => setPassForm({...passForm, currentPassword: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <input type="password" className="input-field" placeholder="Min. 6 characters" value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} />
                </div>
                <button type="submit" disabled={passLoading} className="btn-secondary">
                  <Lock size={15} />
                  {passLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
