import { useState, useEffect, useCallback } from 'react';
import { hackathonService } from '../services';
import MainLayout from '../layouts/MainLayout';
import HackathonCard from '../components/hackathon/HackathonCard';
import Loader from '../components/common/Loader';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const MODES = ['Online', 'Offline', 'Hybrid'];
const STATUSES = ['Registration Open', 'Registration Closed', 'Ongoing', 'Completed'];

const HackathonListing = () => {
  const [hackathons, setHackathons] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const [filters, setFilters] = useState({ search: '', mode: '', status: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchHackathons = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.mode) params.mode = filters.mode;
      if (filters.status) params.status = filters.status;
      const res = await hackathonService.getAll(params);
      setHackathons(res.data.hackathons);
      setTotal(res.data.total);
    } catch {
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.mode, filters.status]);

  useEffect(() => { fetchHackathons(); }, [fetchHackathons]);

  const clearFilters = () => {
    setFilters({ search: '', mode: '', status: '' });
    setPage(1);
  };

  const hasFilters = filters.search || filters.mode || filters.status;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 pt-12 pb-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="page-title mb-2">Explore Hackathons</h1>
          <p className="text-gray-400">Discover {total} hackathons. Find your perfect challenge.</p>

          {/* Search bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                className="input-field pl-12 py-3.5 text-base"
                placeholder="Search hackathons by title, theme..."
                value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
              />
              {filters.search && (
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" onClick={() => setFilters({ ...filters, search: '' })}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 px-4 ${showFilters ? 'border-purple-500/50 text-purple-400' : ''}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-purple-500 rounded-full" />}
            </button>
          </div>

          {/* Filter bar */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 items-center p-4 glass-card">
              <div>
                <span className="input-label mb-1">Mode</span>
                <div className="flex gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setFilters({ ...filters, mode: filters.mode === m ? '' : m }); setPage(1); }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filters.mode === m ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="input-label mb-1">Status</span>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setFilters({ ...filters, status: filters.status === s ? '' : s }); setPage(1); }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filters.status === s ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <X size={13} /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <Loader text="Loading hackathons..." />
        ) : hackathons.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-xl mb-2">No hackathons found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary mt-4">Clear Filters</button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">Showing {hackathons.length} of {total} hackathons</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hackathons.map((h) => <HackathonCard key={h._id} hackathon={h} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn-secondary px-4 disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="btn-secondary px-4 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HackathonListing;
