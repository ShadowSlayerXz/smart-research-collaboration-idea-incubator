import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Smart Research Collaboration
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Share ideas, find collaborators, and turn your research into reality — all in one platform built for college innovators.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
        >
          Get Started <FiArrowRight />
        </Link>
        <Link
          to="/login"
          className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
