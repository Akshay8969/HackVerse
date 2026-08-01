import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { submissionService, teamService, hackathonService } from '../services';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { Upload, GitBranch, Globe, FileText, Video, Code, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const SubmissionPage = () => {
  const { hackathonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    projectName: '', problemStatement: '', solution: '', description: '',
    githubRepo: '', liveDemoUrl: '', techStack: '', demoVideoLink: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, teamRes, subRes] = await Promise.all([
          hackathonService.getById(hackathonId),
          teamService.getMyTeam(hackathonId),
          submissionService.getMy(hackathonId),
        ]);
        setHackathon(hackRes.data.hackathon);
        setTeam(teamRes.data.team);
        const sub = subRes.data.submission;
        setSubmission(sub);
        if (sub) {
          setForm({
            projectName: sub.projectName || '',
            problemStatement: sub.problemStatement || '',
            solution: sub.solution || '',
            description: sub.description || '',
            githubRepo: sub.githubRepo || '',
            liveDemoUrl: sub.liveDemoUrl || '',
            techStack: sub.techStack?.join(', ') || '',
            demoVideoLink: sub.demoVideoLink || '',
          });
        }
      } catch {
        toast.error('Failed to load submission data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hackathonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team) { toast.error('You need a team to submit a project'); return; }

    const techStackArr = form.techStack.split(',').map(t => t.trim()).filter(Boolean);
    if (!form.projectName || !form.problemStatement || !form.solution) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('hackathonId', hackathonId);
      formData.append('teamId', team._id);
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'techStack') formData.append(k, v);
      });
      techStackArr.forEach(t => formData.append('techStack[]', t));

      let res;
      if (submission) {
        res = await submissionService.update(submission._id, formData);
        toast.success('Submission updated successfully!');
      } else {
        res = await submissionService.create(formData);
        toast.success('Project submitted successfully! 🚀');
      }
      setSubmission(res.data.submission);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <MainLayout><Loader text="Loading..." /></MainLayout>;

  const isPastDeadline = hackathon && new Date() > new Date(hackathon.endDate);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to={`/team/${hackathonId}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 group">
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Team
        </Link>

        <div className="mb-8">
          <h1 className="page-title text-2xl">
            {submission ? 'Update Submission' : 'Submit Project'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            for <span className="text-purple-400 font-medium">{hackathon?.title}</span>
          </p>
        </div>

        {!team ? (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400 mb-4">You need a team before submitting a project.</p>
            <Link to={`/team/${hackathonId}`} className="btn-primary">Create or Join a Team</Link>
          </div>
        ) : isPastDeadline && !submission ? (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400">Submission deadline has passed.</p>
          </div>
        ) : (
          <>
            {submission && (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 mb-6">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Project submitted! Status: <span className="capitalize">{submission.status}</span></span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass-card p-6 space-y-5">
                <h3 className="text-white font-semibold">Project Details</h3>

                <div>
                  <label className="input-label">Project Name *</label>
                  <input className="input-field" placeholder="My Awesome Project" value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} required />
                </div>

                <div>
                  <label className="input-label">Problem Statement *</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="What problem does your project solve?" value={form.problemStatement} onChange={e => setForm({ ...form, problemStatement: e.target.value })} required />
                </div>

                <div>
                  <label className="input-label">Solution *</label>
                  <textarea className="input-field resize-none" rows={4} placeholder="Describe your solution in detail..." value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} required />
                </div>

                <div>
                  <label className="input-label">Additional Description</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Any other details, challenges faced, future scope..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                <div>
                  <label className="input-label flex items-center gap-1"><Code size={12} /> Tech Stack (comma separated)</label>
                  <input className="input-field" placeholder="React, Node.js, MongoDB, Express..." value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} />
                </div>
              </div>

              <div className="glass-card p-6 space-y-5">
                <h3 className="text-white font-semibold">Links & Resources</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label flex items-center gap-1"><GitBranch size={12} /> GitHub Repository</label>
                    <input className="input-field" placeholder="https://github.com/..." value={form.githubRepo} onChange={e => setForm({ ...form, githubRepo: e.target.value })} />
                  </div>
                  <div>
                    <label className="input-label flex items-center gap-1"><Globe size={12} /> Live Demo URL</label>
                    <input className="input-field" placeholder="https://myproject.vercel.app" value={form.liveDemoUrl} onChange={e => setForm({ ...form, liveDemoUrl: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="input-label flex items-center gap-1"><Video size={12} /> Demo Video Link</label>
                  <input className="input-field" placeholder="https://youtube.com/..." value={form.demoVideoLink} onChange={e => setForm({ ...form, demoVideoLink: e.target.value })} />
                </div>
              </div>

              <button type="submit" disabled={submitting || (isPastDeadline && !!submission)} className="btn-primary w-full justify-center py-3.5 text-base">
                <Save size={18} />
                {submitting ? 'Submitting...' : submission ? 'Update Submission' : 'Submit Project'}
              </button>
            </form>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SubmissionPage;
