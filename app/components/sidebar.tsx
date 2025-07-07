export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Codex</h1>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="block hover:text-blue-400">Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block hover:text-blue-400">Notebooks</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block hover:text-blue-400">Settings</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}