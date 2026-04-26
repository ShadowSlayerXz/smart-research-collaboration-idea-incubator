import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useIdeaStore } from '../store/ideaStore';
import IdeaCard from '../components/idea/IdeaCard';
import { FiPlusCircle } from 'react-icons/fi';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { ideas, fetchIdeas } = useIdeaStore();

  useEffect(() => { fetchIdeas(); }, []);

  const myIdeas = ideas.filter((i) => i.author?._id === user?._id || i.author === user?._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/ideas/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <FiPlusCircle /> New Idea
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-indigo-600">{myIdeas.length}</p>
          <p className="text-gray-500 text-sm">My Ideas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-green-500">
            {myIdeas.filter((i) => i.status === 'open').length}
          </p>
          <p className="text-gray-500 text-sm">Open</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-yellow-500">
            {myIdeas.filter((i) => i.status === 'in-progress').length}
          </p>
          <p className="text-gray-500 text-sm">In Progress</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Ideas</h2>
      {myIdeas.length === 0 ? (
        <p className="text-gray-400">You haven't submitted any ideas yet. <Link to="/ideas/new" className="text-indigo-600 hover:underline">Create one!</Link></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myIdeas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
        </div>
      )}
    </div>
  );
}
