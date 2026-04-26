import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiLogOut, FiUser, FiPlusCircle, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          IdeaIncubator
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/home" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiHome /> Home
              </Link>
              <Link to="/ideas/new" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiPlusCircle /> New Idea
              </Link>
              <Link to={`/profile/${user._id}`} className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiUser /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
