"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
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

interface UserProfile {
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchProfile();
    fetchUserRepositories();
  }, [username, isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      // For now, use the current user's data or fetch from API
      // In a real app, you'd fetch the profile by username
      if (user && user.username === username) {
        setProfile({
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: "Full-stack developer passionate about building amazing web applications.",
          location: "San Francisco, CA",
          website: "https://example.com",
          joinedDate: "January 2024",
        });
      } else {
        // Fetch other user's profile
        setProfile({
          username: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          email: `${username}@github.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          bio: "Software developer and open source enthusiast.",
          location: "New York, NY",
          website: "https://example.com",
          joinedDate: "January 2024",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRepositories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/repositories");
      const data = await response.json();
      // Filter repositories by owner
      const userRepos = data.filter(
        (repo: Repository) => repo.owner === username
      );
      setRepositories(userRepos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
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
              {user && (
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
              )}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={120}
                height={120}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-200"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mb-4">{profile.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {profile.location && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {profile.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Repositories Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Repositories ({repositories.length})
          </h2>
          {repositories.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No repositories found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repositories.map((repo) => (
                <Link
                  key={repo.id}
                  href={`/repositories/${repo.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-indigo-600 hover:text-indigo-700">
                          {repo.owner}/{repo.name}
                        </h3>
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
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {repo.stars}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7.707 3.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 2.586V1a1 1 0 10-2 0v1.586L7.707 3.293zM11 7a1 1 0 100-2h-1a1 1 0 100 2h1zM16 9a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.293 13.707a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 10-1.414 1.414L15.586 12l-1.293 1.293zM3 11a1 1 0 100 2h1a1 1 0 100-2H3zM5.293 6.707a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414zM13 17a1 1 0 100-2h-1a1 1 0 100 2h1zM9 13a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
                          </svg>
                          {repo.forks}
                        </span>
                        <span>
                          Updated {new Date(repo.updatedAt).toLocaleDateString()}
                        </span>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

