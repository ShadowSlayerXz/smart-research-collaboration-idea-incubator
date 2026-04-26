import { useNavigate } from 'react-router-dom';
import { useIdeaStore } from '../store/ideaStore';
import IdeaForm from '../components/idea/IdeaForm';
import { toast } from 'react-toastify';

export default function CreateIdeaPage() {
  const createIdea = useIdeaStore((s) => s.createIdea);
  const navigate = useNavigate();

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const idea = await createIdea(values);
      toast.success('Idea submitted!');
      navigate(`/ideas/${idea._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create idea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a New Idea</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <IdeaForm onSubmit={handleSubmit} submitLabel="Submit Idea" />
      </div>
    </div>
  );
}
