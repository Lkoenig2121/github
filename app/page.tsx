"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface Repository {
  id: number;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  isPrivate: boolean;
  topics: string[];
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRepositories();
    }
  }, [isAuthenticated]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/repositories");
      const data = await response.json();
      // Sort by stars descending and take top 10
      const sorted = data
        .sort((a: Repository, b: Repository) => b.stars - a.stars)
        .slice(0, 10);
      setRepositories(sorted);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    // Authenticated user - show dashboard with sidebar
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/" className="flex items-center">
                  <svg
                    className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
                <nav className="hidden sm:flex space-x-3 md:space-x-4">
                  <Link
                    href="/"
                    className="text-sm md:text-base text-gray-900 font-semibold hover:text-gray-700 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/repositories"
                    className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Repositories
                  </Link>
                  <Link
                    href="/issues"
                    className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Issues
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href={`/profile/${user.username}`}
                  className="hidden sm:flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    unoptimized
                  />
                  <span className="text-xs sm:text-sm text-gray-700 hidden md:inline">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="sm:hidden py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 pb-3 border-b border-gray-200 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                      unoptimized
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {user.name}
                    </span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-900 font-semibold hover:text-gray-700 py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/repositories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 py-2"
                  >
                    Repositories
                  </Link>
                  <Link
                    href="/issues"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 py-2"
                  >
                    Issues
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col md:flex-row max-w-full">
          {/* Left Sidebar - Top Repositories */}
          <aside className="w-full md:w-64 lg:w-80 xl:w-96 bg-white border-r border-gray-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top repositories
                </h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  New
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Find a repository..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="shrink-0 mt-0.5">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/profile/${repo.owner}`}
                              className="text-sm font-medium text-gray-600 hover:text-indigo-600 truncate"
                            >
                              {repo.owner}
                            </Link>
                            <span className="text-gray-400">/</span>
                            <Link
                              href={`/repositories/${repo.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate"
                            >
                              {repo.name}
                            </Link>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {repo.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            {repo.language && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                                {repo.language}
                              </span>
                            )}
                            <span className="flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {repo.stars}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/repositories"
                    className="block text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
                  >
                    Show more
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main Feed Area */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Home Section Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Home
                </h1>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Ask anything"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    + Add repositories, files, and spaces
                  </p>
                  <Link
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Try the new dashboard experience
                  </Link>
                </div>
              </div>

              {/* Feed Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Feed</h2>
                  <Link
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    See more
                  </Link>
                </div>

                {/* Trending Repositories */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    Trending repositories
                  </h3>
                  <div className="space-y-4">
                    {repositories.slice(0, 6).map((repo) => (
                      <div
                        key={repo.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/profile/${repo.owner}`}
                                className="text-sm text-gray-600 hover:text-indigo-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {repo.owner}
                              </Link>
                              <span className="text-gray-400">/</span>
                              <Link
                                href={`/repositories/${repo.id}`}
                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-700"
                              >
                                {repo.name}
                              </Link>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {repo.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {repo.language && (
                            <span className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {repo.stars >= 1000
                              ? `${(repo.stars / 1000).toFixed(1)}k`
                              : repo.stars}{" "}
                            stars
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(repo.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Not authenticated - show landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-semibold text-gray-900">
                  GitHub Clone
                </span>
              </Link>
            </div>
            <div>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 sm:py-16 md:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 leading-tight">
            Where the world builds software
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            A GitHub-like platform to explore repositories, manage issues, and
            collaborate on projects. Built with Next.js, TypeScript, and
            Tailwind CSS.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm sm:text-base md:text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/repositories"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm sm:text-base md:text-lg"
            >
              Explore Repositories
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 sm:py-16 md:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
            Everything you need to manage your code
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Repository Management
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Browse and explore repositories with detailed information about
                stars, forks, languages, and topics.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Issue Tracking
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track issues across your repositories. Filter by
                status, view details, and stay organized.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Code Exploration
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Dive deep into repository structures, view file hierarchies, and
                explore code organization.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 sm:py-16 md:py-20 text-center">
          <div className="bg-indigo-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Sign in to explore repositories and start managing your projects
            </p>
            <Link
              href="/login"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base md:text-lg"
            >
              Sign in to GitHub Clone
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Built with Next.js, TypeScript, Tailwind CSS, and Express
            </p>
            <p className="text-xs sm:text-sm">
              © 2024 GitHub Clone. Demo application for educational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
