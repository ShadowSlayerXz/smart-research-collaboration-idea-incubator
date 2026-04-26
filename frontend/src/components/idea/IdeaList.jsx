import IdeaCard from './IdeaCard';

export default function IdeaList({ ideas }) {
  if (!ideas.length) {
    return <p className="text-center text-gray-400 py-12">No ideas found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
    </div>
  );
}
