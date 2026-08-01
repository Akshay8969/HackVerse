import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamService, hackathonService } from '../services';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { Users, Plus, UserMinus, Crown, ArrowRight, UserPlus, Trash2, ArrowLeft } from 'lucide-react';

const TeamPage = () => {
  const { hackathonId } = useParams();
  const { user } = useAuth();

  const [hackathon, setHackathon] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, teamRes] = await Promise.all([
          hackathonService.getById(hackathonId),
          teamService.getMyTeam(hackathonId),
        ]);
        setHackathon(hackRes.data.hackathon);
        setTeam(teamRes.data.team);
      } catch (err) {
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hackathonId]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreating(true);
    try {
      const res = await teamService.create({ name: teamName, hackathonId });
      setTeam(res.data.team);
      toast.success('Team created!');
      setTeamName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAdding(true);
    try {
      const res = await teamService.addMember(team._id, memberEmail);
      setTeam(res.data.team);
      toast.success('Member added!');
      setMemberEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const res = await teamService.removeMember(team._id, memberId);
      setTeam(res.data.team);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleTransferLeadership = async (newLeaderId) => {
    if (!confirm('Transfer leadership to this member?')) return;
    try {
      const res = await teamService.transferLeadership(team._id, newLeaderId);
      setTeam(res.data.team);
      toast.success('Leadership transferred!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to transfer leadership');
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    try {
      await teamService.delete(team._id);
      setTeam(null);
      toast.success('Team deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete team');
    }
  };

  const isLeader = team?.leader?._id === user?._id;
  const isFull = team && hackathon && team.members?.length >= hackathon.maxTeamSize;

  if (loading) return <MainLayout><Loader text="Loading team..." /></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to={`/hackathons/${hackathonId}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 group">
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Hackathon
        </Link>

        {hackathon && (
          <div className="mb-6">
            <h1 className="page-title text-2xl">Team Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              for <span className="text-purple-400 font-medium">{hackathon.title}</span> · Max {hackathon.maxTeamSize} members
            </p>
          </div>
        )}

        {!team ? (
          /* Create team */
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Users size={30} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">You don't have a team yet</h2>
            <p className="text-gray-400 text-sm mb-8">Create a team to start collaborating with others</p>
            <form onSubmit={handleCreateTeam} className="flex gap-3 max-w-sm mx-auto">
              <input
                className="input-field"
                placeholder="Enter team name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <button type="submit" disabled={creating} className="btn-primary whitespace-nowrap">
                <Plus size={16} />
                {creating ? '...' : 'Create'}
              </button>
            </form>
          </div>
        ) : (
          /* Team card */
          <div className="space-y-6">
            {/* Team header */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-2xl">{team.name}</h2>
                  <p className="text-gray-400 text-sm">{team.members?.length}/{hackathon?.maxTeamSize} members</p>
                </div>
                {isLeader && (
                  <button onClick={handleDeleteTeam} className="btn-danger text-xs px-3 py-2">
                    <Trash2 size={13} /> Delete Team
                  </button>
                )}
              </div>

              {/* Members list */}
              <div className="space-y-3">
                {team.members?.map((member) => {
                  const memberIsLeader = member._id === team.leader?._id;
                  const isCurrentUser = member._id === user?._id;
                  return (
                    <div key={member._id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${memberIsLeader ? 'bg-gradient-to-br from-yellow-500 to-amber-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                          {member.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium flex items-center gap-2">
                            {member.name}
                            {memberIsLeader && <Crown size={13} className="text-yellow-400" />}
                            {isCurrentUser && <span className="text-xs text-gray-500">(you)</span>}
                          </div>
                          <div className="text-gray-500 text-xs">{member.email}</div>
                        </div>
                      </div>
                      {isLeader && !memberIsLeader && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTransferLeadership(member._id)}
                            className="text-xs text-yellow-400 hover:text-yellow-300 px-2 py-1 bg-yellow-400/10 rounded-lg"
                          >
                            Make Leader
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded-lg"
                          >
                            <UserMinus size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Member */}
            {isLeader && !isFull && (
              <div className="glass-card p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <UserPlus size={16} className="text-purple-400" /> Add Member by Email
                </h3>
                <form onSubmit={handleAddMember} className="flex gap-3">
                  <input
                    type="email"
                    className="input-field"
                    placeholder="member@email.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                  <button type="submit" disabled={adding} className="btn-primary whitespace-nowrap">
                    <Plus size={16} />
                    {adding ? 'Adding...' : 'Add'}
                  </button>
                </form>
                <p className="text-gray-500 text-xs mt-2">The user must already have a HackVerse account</p>
              </div>
            )}
            {isFull && (
              <div className="text-center text-gray-400 text-sm py-4 glass-card">
                <Users size={20} className="mx-auto mb-2 text-purple-400" />
                Team is full ({hackathon.maxTeamSize} members max)
              </div>
            )}

            {/* Submit Project link */}
            <Link to={`/submit/${hackathonId}`} className="btn-primary w-full justify-center py-3.5 text-base">
              Submit Your Project <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeamPage;
