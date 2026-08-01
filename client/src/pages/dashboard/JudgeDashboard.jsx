import { useState, useEffect } from 'react';
import { dashboardService, reviewService } from '../../services';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { Zap, CheckCircle, Clock, Star, Send, ExternalLink, GitBranch } from 'lucide-react';

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

const CRITERIA = ['innovation', 'technicalComplexity', 'userInterface', 'functionality', 'scalability', 'documentation', 'presentation'];
const CRITERIA_LABELS = {
  innovation: 'Innovation', technicalComplexity: 'Tech Complexity', userInterface: 'UI/UX',
  functionality: 'Functionality', scalability: 'Scalability', documentation: 'Documentation', presentation: 'Presentation',
};

const JudgeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [scores, setScores] = useState(Object.fromEntries(CRITERIA.map(c => [c, 5])));
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dashboardService.getJudge().then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  const fetchSubmissions = async (hackathon) => {
    setActiveHackathon(hackathon);
    setActiveSubmission(null);
    setSubsLoading(true);
    try {
      const res = await reviewService.getAssigned(hackathon._id);
      setSubmissions(res.data.submissions);
    } finally {
      setSubsLoading(false);
    }
  };

  const handleSelectSubmission = (sub) => {
    setActiveSubmission(sub);
    if (sub.review) {
      setScores(sub.review.scores);
      setComments(sub.review.comments || '');
    } else {
      setScores(Object.fromEntries(CRITERIA.map(c => [c, 5])));
      setComments('');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewService.submit({
        submissionId: activeSubmission._id,
        hackathonId: activeHackathon._id,
        scores,
        comments,
      });
      toast.success('Review submitted!');
      // Refresh
      const res = await reviewService.getAssigned(activeHackathon._id);
      setSubmissions(res.data.submissions);
      const updated = res.data.submissions.find(s => s._id === activeSubmission._id);
      if (updated) setActiveSubmission(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const totalScore = CRITERIA.reduce((sum, c) => sum + (Number(scores[c]) || 0), 0);

  if (loading) return <MainLayout><Loader /></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="page-title mb-2">Judge Dashboard</h1>
        <p className="text-gray-400 mb-8">Evaluate submitted projects</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Zap} label="Assigned Hackathons" value={stats?.stats?.assignedHackathons} color="from-purple-500 to-violet-600" />
          <StatCard icon={Clock} label="Total Projects" value={stats?.stats?.totalAssigned} color="from-yellow-500 to-amber-600" />
          <StatCard icon={CheckCircle} label="Reviewed" value={stats?.stats?.completedReviews} color="from-green-500 to-emerald-600" />
          <StatCard icon={Star} label="Pending" value={stats?.stats?.pendingReviews} color="from-pink-500 to-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Hackathon list */}
          <div className="glass-card overflow-hidden h-fit">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Assigned Hackathons</h3>
            </div>
            <div className="divide-y divide-white/5">
              {stats?.assignedHackathons?.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No assigned hackathons</div>
              ) : stats?.assignedHackathons?.map(h => (
                <button key={h._id} onClick={() => fetchSubmissions(h)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${activeHackathon?._id === h._id ? 'bg-purple-500/10 border-l-2 border-purple-500' : ''}`}
                >
                  <div className="text-white text-sm font-medium line-clamp-1">{h.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{h.status}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submissions + Review */}
          <div className="lg:col-span-3 space-y-6">
            {!activeHackathon ? (
              <div className="glass-card p-12 text-center">
                <Star size={40} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Select a hackathon to start reviewing</p>
              </div>
            ) : (
              <>
                {/* Submission list */}
                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Submissions for: <span className="text-purple-400">{activeHackathon.title}</span></h3>
                  </div>
                  {subsLoading ? <Loader /> : (
                    <div className="divide-y divide-white/5">
                      {submissions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No submissions yet</div>
                      ) : submissions.map(sub => (
                        <div
                          key={sub._id}
                          onClick={() => handleSelectSubmission(sub)}
                          className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${activeSubmission?._id === sub._id ? 'bg-purple-500/10' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium text-sm">{sub.projectName}</div>
                              <div className="text-gray-400 text-xs mt-0.5">by {sub.team?.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {sub.reviewed ? (
                                <span className="badge badge-green flex items-center gap-1"><CheckCircle size={11} /> Reviewed</span>
                              ) : (
                                <span className="badge badge-yellow flex items-center gap-1"><Clock size={11} /> Pending</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review form */}
                {activeSubmission && (
                  <div className="glass-card p-6">
                    <h3 className="text-white font-bold mb-1">{activeSubmission.projectName}</h3>
                    <p className="text-gray-400 text-sm mb-5">Team: {activeSubmission.team?.name}</p>

                    {/* Project links */}
                    <div className="flex gap-3 mb-5">
                      {activeSubmission.githubRepo && (
                        <a href={activeSubmission.githubRepo} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 px-3">
                          <GitBranch size={13} /> GitHub
                        </a>
                      )}
                      {activeSubmission.liveDemoUrl && (
                        <a href={activeSubmission.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 px-3">
                          <ExternalLink size={13} /> Live Demo
                        </a>
                      )}
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Score sliders */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CRITERIA.map(c => (
                          <div key={c}>
                            <div className="flex justify-between items-center mb-1">
                              <label className="input-label">{CRITERIA_LABELS[c]}</label>
                              <span className="text-purple-400 font-bold text-sm">{scores[c]}/10</span>
                            </div>
                            <input
                              type="range" min={0} max={10} step={1}
                              value={scores[c]}
                              onChange={e => setScores({ ...scores, [c]: Number(e.target.value) })}
                              className="w-full accent-purple-500 h-2"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Total score */}
                      <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                        <span className="text-gray-300 font-medium">Total Score</span>
                        <span className="text-2xl font-extrabold text-purple-400">{totalScore}/70</span>
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="input-label">Comments & Feedback</label>
                        <textarea
                          className="input-field resize-none"
                          rows={3}
                          placeholder="Provide constructive feedback..."
                          value={comments}
                          onChange={e => setComments(e.target.value)}
                        />
                      </div>

                      <button type="submit" disabled={submitting} className="btn-primary">
                        <Send size={15} />
                        {submitting ? 'Submitting...' : activeSubmission.reviewed ? 'Update Review' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JudgeDashboard;
