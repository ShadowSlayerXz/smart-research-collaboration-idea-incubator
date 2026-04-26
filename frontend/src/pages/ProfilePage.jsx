import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import IdeaCard from '../components/idea/IdeaCard';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchProfile = () =>
    axiosInstance.get(`/api/users/${id}`).then(({ data }) => {
      setProfile(data.user);
      setIdeas(data.ideas);
      setForm({ name: data.user.name, bio: data.user.bio, department: data.user.department });
    });

  useEffect(() => { fetchProfile(); }, [id]);

  const handleSave = async () => {
    try {
      const { data } = await axiosInstance.put(`/api/users/${id}`, form);
      setProfile(data);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const isOwner = authUser?._id === id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="Department"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3} placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                {profile.department && <p className="text-indigo-600 text-sm">{profile.department}</p>}
                {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
              </>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2 ml-4">
              {editing ? (
                <>
                  <button onClick={handleSave} className="text-green-500 hover:text-green-700"><FiCheck size={18} /></button>
                  <button onClick={() => setEditing(false)} className="text-red-400 hover:text-red-600"><FiX size={18} /></button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-600"><FiEdit2 size={18} /></button>
              )}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Submitted Ideas ({ideas.length})</h2>
      {ideas.length === 0 ? (
        <p className="text-gray-400">No ideas submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
        </div>
      )}
    </div>
  );
}
