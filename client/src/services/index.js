import API from './api';

export const authService = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const userService = {
  getAllUsers: (params) => API.get('/users', { params }),
  getUserById: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
  toggleBlock: (id) => API.put(`/users/${id}/block`),
  getJudges: () => API.get('/users/judges'),
};

export const hackathonService = {
  getAll: (params) => API.get('/hackathons', { params }),
  getById: (id) => API.get(`/hackathons/${id}`),
  create: (data) => API.post('/hackathons', data),
  update: (id, data) => API.put(`/hackathons/${id}`, data),
  delete: (id) => API.delete(`/hackathons/${id}`),
  getMy: () => API.get('/hackathons/my'),
  toggleRegistration: (id) => API.put(`/hackathons/${id}/registration`),
  assignJudges: (id, judgeIds) => API.put(`/hackathons/${id}/judges`, { judgeIds }),
  announceWinners: (id) => API.put(`/hackathons/${id}/announce-winners`),
};

export const registrationService = {
  register: (hackathonId) => API.post('/registrations', { hackathonId }),
  cancel: (id) => API.delete(`/registrations/${id}`),
  getMy: () => API.get('/registrations/my'),
  check: (hackathonId) => API.get(`/registrations/check/${hackathonId}`),
  getForHackathon: (hackathonId) => API.get(`/registrations/hackathon/${hackathonId}`),
  updateStatus: (id, status) => API.put(`/registrations/${id}/status`, { status }),
};

export const teamService = {
  create: (data) => API.post('/teams', data),
  getMyTeam: (hackathonId) => API.get(`/teams/my/${hackathonId}`),
  getHackathonTeams: (hackathonId) => API.get(`/teams/hackathon/${hackathonId}`),
  getById: (id) => API.get(`/teams/${id}`),
  addMember: (id, email) => API.post(`/teams/${id}/members`, { email }),
  removeMember: (id, memberId) => API.delete(`/teams/${id}/members/${memberId}`),
  transferLeadership: (id, newLeaderId) => API.put(`/teams/${id}/transfer-leadership`, { newLeaderId }),
  delete: (id) => API.delete(`/teams/${id}`),
};

export const submissionService = {
  create: (data) => API.post('/submissions', data),
  update: (id, data) => API.put(`/submissions/${id}`, data),
  getMy: (hackathonId) => API.get(`/submissions/my/${hackathonId}`),
  getForHackathon: (hackathonId) => API.get(`/submissions/hackathon/${hackathonId}`),
  getById: (id) => API.get(`/submissions/${id}`),
  updateStatus: (id, status) => API.put(`/submissions/${id}/status`, { status }),
};

export const reviewService = {
  submit: (data) => API.post('/reviews', data),
  getAssigned: (hackathonId) => API.get(`/reviews/assigned/${hackathonId}`),
  getMyReview: (submissionId) => API.get(`/reviews/my/${submissionId}`),
  getForSubmission: (submissionId) => API.get(`/reviews/submission/${submissionId}`),
};

export const leaderboardService = {
  get: (hackathonId) => API.get(`/leaderboard/${hackathonId}`),
};

export const dashboardService = {
  getAdmin: () => API.get('/dashboard/admin'),
  getOrganizer: () => API.get('/dashboard/organizer'),
  getParticipant: () => API.get('/dashboard/participant'),
  getJudge: () => API.get('/dashboard/judge'),
};
