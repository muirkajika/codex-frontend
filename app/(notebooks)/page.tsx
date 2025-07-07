import { NotebookList } from "./components/notebook-list";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

export default function NotebooksPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Notebooks</h1>
      <p className="mb-8 text-gray-600">
        Here are all the notebooks from your Codex instance.
      </p>

      {/* The NotebookList component will handle fetching and displaying the data */}
      <NotebookList />
    </div>
  )
}