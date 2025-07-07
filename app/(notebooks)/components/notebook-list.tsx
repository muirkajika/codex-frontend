"use client"; // This marks the component as a Client Component

import { useState, useEffect, FormEvent } from 'react';

// Define a type for our notebook data for type safety
interface Notebook {
  id: string;
  name: string;
  createdAt: string;
}

// Get the API URL from environment variables
// IMPORTANT: This requires you to create a .env.local file
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function NotebookList() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNotebookName, setNewNotebookName] = useState('');

  // Function to fetch notebooks from the backend
  const fetchNotebooks = async () => {
    if (!API_URL) {
      setError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notebooks`);
      if (!response.ok) {
        throw new Error('Failed to fetch notebooks');
      }
      const data: Notebook[] = await response.json();
      setNotebooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to run the fetch function when the component loads
  useEffect(() => {
    fetchNotebooks();
  }, []);

  // Function to handle form submission for creating a new notebook
  const handleCreateNotebook = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim() || !API_URL) return;

    try {
      const response = await fetch(`${API_URL}/notebooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNotebookName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create notebook');
      }
      
      setNewNotebookName(''); // Clear the input
      fetchNotebooks(); // Re-fetch the list to show the new notebook
    } catch (err: any) {
      setError(err.message);
    }
  };


  if (isLoading) return <p>Loading notebooks...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Form for creating a new notebook */}
      <form onSubmit={handleCreateNotebook} className="mb-6 flex gap-4">
        <input 
          type="text"
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
          placeholder="New notebook name..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create
        </button>
      </form>

      {/* List of existing notebooks */}
      <ul className="space-y-3">
        {notebooks.length > 0 ? (
          notebooks.map((notebook) => (
            <li key={notebook.id} className="p-4 border border-gray-200 rounded-md">
              <p className="font-semibold">{notebook.name}</p>
              <p className="text-sm text-gray-500">
                Created on: {new Date(notebook.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))
        ) : (
          <p>No notebooks found. Create one above!</p>
        )}
      </ul>
    </div>
  );
}