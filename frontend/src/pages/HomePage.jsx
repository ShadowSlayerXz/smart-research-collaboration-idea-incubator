import { useEffect } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import IdeaList from '../components/idea/IdeaList';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = ['', 'Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];
const STATUSES = ['', 'open', 'in-progress', 'completed'];

export default function HomePage() {
  const { ideas, loading, pages, page, filters, setFilters, setPage, fetchIdeas } = useIdeaStore();

  useEffect(() => { fetchIdeas(); }, [filters, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Ideas</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-48 bg-white">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text" placeholder="Search ideas..."
            className="flex-1 outline-none text-sm"
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading ideas...</p>
      ) : (
        <IdeaList ideas={ideas} />
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg text-sm border ${p === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
