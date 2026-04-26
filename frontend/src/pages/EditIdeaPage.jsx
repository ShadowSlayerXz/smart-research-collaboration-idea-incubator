import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIdeaStore } from '../store/ideaStore';
import IdeaForm from '../components/idea/IdeaForm';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

export default function EditIdeaPage() {
  const { id } = useParams();
  const updateIdea = useIdeaStore((s) => s.updateIdea);
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/ideas/${id}`).then(({ data }) => setIdea(data));
  }, [id]);

  const handleSubmit = async (values, setSubmitting) => {
    try {
      await updateIdea(id, values);
      toast.success('Idea updated!');
      navigate(`/ideas/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update idea');
    } finally {
      setSubmitting(false);
    }
  };

  if (!idea) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const initialValues = {
    title: idea.title,
    description: idea.description,
    category: idea.category,
    tags: idea.tags?.join(', ') || '',
    status: idea.status,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Idea</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <IdeaForm initialValues={initialValues} onSubmit={handleSubmit} showStatus submitLabel="Update Idea" />
      </div>
    </div>
  );
}
