import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { leaderboardService, hackathonService } from '../services';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import { Trophy, Medal, Star, ExternalLink, GitBranch } from 'lucide-react';

const medalColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600'];
const medalBgs = ['bg-yellow-400/15 border-yellow-400/30', 'bg-gray-400/10 border-gray-400/20', 'bg-amber-600/15 border-amber-600/30'];

const Leaderboard = () => {
  const location = useLocation();
  const [hackathons, setHackathons] = useState([]);
  const [selectedId, setSelectedId] = useState(location.state?.hackathonId || '');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hackLoading, setHackLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonService.getAll({ status: 'Completed', limit: 50 });
        setHackathons(res.data.hackathons);
        if (!selectedId && res.data.hackathons.length > 0) {
          setSelectedId(res.data.hackathons[0]._id);
        }
      } finally {
        setHackLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await leaderboardService.get(selectedId);
        setLeaderboard(res.data.leaderboard);
      } catch {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedId]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 pt-12 pb-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-yellow-400" />
            <h1 className="page-title">Leaderboard</h1>
          </div>
          <p className="text-gray-400">Rankings based on average judge scores</p>

          {/* Hackathon selector */}
          {!hackLoading && hackathons.length > 0 && (
            <div className="mt-6">
              <label className="input-label">Select Hackathon</label>
              <select
                className="input-field max-w-md"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {hackathons.map((h) => (
                  <option key={h._id} value={h._id} style={{ background: '#1e1e2e' }}>{h.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {hackLoading || loading ? (
          <Loader text="Loading leaderboard..." />
        ) : !selectedId || hackathons.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={60} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-white font-semibold text-xl mb-2">No completed hackathons yet</h3>
            <p className="text-gray-400">Check back after hackathons are completed and winners are announced</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Star size={60} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-white font-semibold text-xl mb-2">No reviews yet</h3>
            <p className="text-gray-400">Judges haven't scored any submissions for this hackathon</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
                  if (!entry) return <div key={i} />;
                  const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const heights = ['h-32', 'h-44', 'h-28'];
                  return (
                    <div key={entry.submission?._id} className="text-center">
                      <div className={`${medalBgs[rank - 1]} border rounded-t-2xl p-4 flex flex-col items-center justify-end ${heights[i]}`}>
                        <Medal size={24} className={medalColors[rank - 1]} />
                        <div className="text-white font-bold text-sm mt-2 line-clamp-1">{entry.submission?.team?.name || 'N/A'}</div>
                        <div className={`text-sm font-bold mt-1 ${medalColors[rank - 1]}`}>{entry.avgScore}/70</div>
                      </div>
                      <div className={`${medalBgs[rank - 1]} border border-t-0 rounded-b-xl py-1`}>
                        <span className={`text-2xl font-extrabold ${medalColors[rank - 1]}`}>#{rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Rank</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Team</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Project</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">Avg Score</th>
                    <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">Links</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => {
                    const { rank, submission, avgScore, totalReviews } = entry;
                    const team = submission?.team;
                    const isTop3 = rank <= 3;
                    return (
                      <tr key={submission?._id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isTop3 ? 'bg-white/3' : ''}`}>
                        <td className="px-6 py-4">
                          <span className={`text-xl font-extrabold ${medalColors[rank - 1] || 'text-gray-300'}`}>
                            #{rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {team?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{team?.name || 'N/A'}</div>
                              <div className="text-gray-500 text-xs">{team?.members?.length || 0} members</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm font-medium">{submission?.projectName}</div>
                          <div className="text-gray-500 text-xs mt-0.5 line-clamp-1">{submission?.techStack?.join(', ')}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-white font-bold">{avgScore}</div>
                          <div className="text-gray-500 text-xs">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {submission?.githubRepo && (
                              <a href={submission.githubRepo} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <GitBranch size={16} />
                              </a>
                            )}
                            {submission?.liveDemoUrl && (
                              <a href={submission.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
