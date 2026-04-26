import { FiTrash2, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function Comment({ comment, onDelete }) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?._id === comment.author?._id;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
        <FiUser />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{comment.author?.name}</span>
          {isOwner && (
            <button onClick={() => onDelete(comment._id)} className="text-red-400 hover:text-red-600">
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
