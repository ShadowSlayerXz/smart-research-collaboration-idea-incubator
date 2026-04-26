import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiTag } from 'react-icons/fi';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-yellow-100 text-yellow-700',
  Social: 'bg-green-100 text-green-700',
  Science: 'bg-purple-100 text-purple-700',
  Art: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function IdeaCard({ idea }) {
  return (
    <Link to={`/ideas/${idea._id}`} className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[idea.category] || 'bg-gray-100 text-gray-700'}`}>
          {idea.category}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full border ${idea.status === 'open' ? 'border-green-400 text-green-600' : idea.status === 'in-progress' ? 'border-yellow-400 text-yellow-600' : 'border-gray-400 text-gray-500'}`}>
          {idea.status}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{idea.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{idea.description}</p>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {idea.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <FiTag size={10} />{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{idea.author?.name}</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><FiHeart />{idea.interestedUsers?.length || 0}</span>
          <span className="flex items-center gap-1"><FiUsers />{idea.collaborators?.length || 0}</span>
        </div>
      </div>
    </Link>
  );
}
