import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Go Home
      </Link>
    </div>
  );
}
