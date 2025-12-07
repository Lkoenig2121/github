'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

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

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchRepositories();
  }, [isAuthenticated, router]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/repositories');
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <svg className="h-8 w-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <nav className="flex space-x-4">
                <Link href="/repositories" className="text-gray-900 font-semibold hover:text-gray-700">
                  Repositories
                </Link>
                <Link href="/issues" className="text-gray-600 hover:text-gray-900">
                  Issues
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Top Repositories</h1>
          <p className="mt-2 text-gray-600">Explore the most popular repositories</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading repositories...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Link
                        href={`/profile/${repo.owner}`}
                        className="text-sm text-gray-600 hover:text-indigo-600"
                      >
                        {repo.owner}
                      </Link>
                      <span className="text-gray-400">/</span>
                      <Link
                        href={`/repositories/${repo.id}`}
                        className="text-xl font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        {repo.name}
                      </Link>
                      {repo.isPrivate && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{repo.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stars}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7.707 3.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 2.586V1a1 1 0 10-2 0v1.586L7.707 3.293zM11 7a1 1 0 100-2h-1a1 1 0 100 2h1zM16 9a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.293 13.707a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 10-1.414 1.414L15.586 12l-1.293 1.293zM3 11a1 1 0 100 2h1a1 1 0 100-2H3zM5.293 6.707a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414zM13 17a1 1 0 100-2h-1a1 1 0 100 2h1zM9 13a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
                        </svg>
                        {repo.forks}
                      </span>
                      <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {repo.topics.map((topic) => (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

