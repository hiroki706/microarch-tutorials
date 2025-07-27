import { Outlet, useMatches } from "react-router";

export default function Layout() {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <h1>My Blog</h1>
      </header>
      <Outlet />
      <footer className="bg-gray-800 text-white p-4 mt-4 absolute bottom-0 w-full">
        <p>&copy; 2023 My Blog</p>
      </footer>
    </div>
  );
}
