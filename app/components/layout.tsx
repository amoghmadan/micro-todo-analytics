import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

const navItems = [
  { to: "/dashboard", label: "Tasks" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
  }`;

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-lg font-bold tracking-tight text-gray-900 dark:text-white"
            >
              MTA
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label }) => (
                <NavLink key={to} to={to} className={linkClasses}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              Sign out
            </button>
          </div>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden dark:border-gray-800 dark:bg-gray-900">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
