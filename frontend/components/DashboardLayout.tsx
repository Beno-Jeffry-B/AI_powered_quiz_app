"use client";

import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand - Left */}
          <div className="flex-1 flex justify-start">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:inline">QuizAI</span>
            </div>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex justify-center items-center gap-10">
            <a href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-all hover:-translate-y-0.5">
              Dashboard
            </a>
            <a href="/history" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-all hover:-translate-y-0.5">
              History
            </a>
          </nav>

          {/* Logout - Right */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600
                         bg-gray-50 hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all border border-transparent hover:border-red-100 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 text-center">
        <p className="text-gray-400 font-bold text-sm tracking-wide">
          Made with <span className="text-red-500 animate-pulse inline-block mx-1">❤️</span> by Beno Jeffry
        </p>
      </footer>
    </div>
  );
}
