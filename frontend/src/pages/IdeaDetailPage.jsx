import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useIdeaStore } from '../store/ideaStore';
import Comment from '../components/comment/Comment';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiHeart, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const deleteIdea = useIdeaStore((s) => s.deleteIdea);
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const fetchIdea = () => axiosInstance.get(`/api/ideas/${id}`).then(({ data }) => setIdea(data));
  const fetchComments = () => axiosInstance.get(`/api/comments?ideaId=${id}`).then(({ data }) => setComments(data));

  useEffect(() => { fetchIdea(); fetchComments(); }, [id]);

  const handleInterest = async () => {
    await axiosInstance.post(`/api/ideas/${id}/interest`);
    fetchIdea();
  };

  const handleCollaborate = async () => {
    await axiosInstance.post(`/api/ideas/${id}/collaborate`);
    fetchIdea();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this idea?')) return;
    await deleteIdea(id);
    toast.success('Idea deleted');
    navigate('/home');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axiosInstance.post('/api/comments', { text: commentText, ideaId: id });
      setCommentText('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    await axiosInstance.delete(`/api/comments/${commentId}`);
    fetchComments();
  };

  if (!idea) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const isAuthor = user?._id === idea.author?._id;
  const isInterested = idea.interestedUsers?.some((u) => u._id === user?._id);
  const isCollaborating = idea.collaborators?.some((u) => u._id === user?._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mr-2">{idea.category}</span>
            <span className="text-xs border border-gray-300 text-gray-500 px-2 py-1 rounded-full">{idea.status}</span>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link to={`/ideas/${id}/edit`} className="text-indigo-500 hover:text-indigo-700"><FiEdit2 /></Link>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{idea.title}</h1>
        <p className="text-gray-600 mb-4">{idea.description}</p>
        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={handleInterest}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition ${isInterested ? 'bg-red-50 border-red-400 text-red-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiHeart /> {idea.interestedUsers?.length || 0} Interested
          </button>
          <button
            onClick={handleCollaborate}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition ${isCollaborating ? 'bg-indigo-50 border-indigo-400 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiUsers /> {idea.collaborators?.length || 0} Collaborators
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Discussion</h2>
        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text" placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={commentText} onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Post
          </button>
        </form>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => <Comment key={c._id} comment={c} onDelete={handleDeleteComment} />)
        )}
      </div>
    </div>
  );
}
