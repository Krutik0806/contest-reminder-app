import React, { useState, useEffect } from 'react';
import { format, isToday, isThisWeek, isPast } from 'date-fns';
import { contestsAPI, remindersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import { downloadICS } from '../utils/calendar';

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('week'); // 'today', 'week', 'all'
  const [platformFilter, setPlatformFilter] = useState('all');
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();

  const platforms = ['all', 'Codeforces', 'CodeChef', 'LeetCode', 'AtCoder', 'HackerRank', 'HackerEarth'];

  useEffect(() => {
    loadContests();
    if (user) {
      loadReminders();
    }
  }, [filter, platformFilter]);

  const loadContests = async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getAll({
        timeFilter: filter === 'all' ? undefined : filter,
        platform: platformFilter
      });
      setContests(response.data);
    } catch (error) {
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const loadReminders = async () => {
    try {
      const response = await remindersAPI.getAll();
      setReminders(response.data);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const handleRemindMe = async (contestId) => {
    try {
      await remindersAPI.create({
        contestId,
        remindAt: ['1hr', '30min']
      });
      toast.success('Reminder set successfully! 🔔');
      loadReminders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to set reminder');
    }
  };

  const hasReminder = (contestId) => {
    return reminders.some(r => r.contestId._id === contestId);
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Codeforces': 'bg-blue-100 text-blue-800',
      'CodeChef': 'bg-orange-100 text-orange-800',
      'LeetCode': 'bg-yellow-100 text-yellow-800',
      'AtCoder': 'bg-green-100 text-green-800',
      'HackerRank': 'bg-emerald-100 text-emerald-800',
      'HackerEarth': 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Upcoming Contests 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Never miss a coding contest again! Set reminders and get notified.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search contests by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Time Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Filter
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'today'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📅 Today
                </button>
                <button
                  onClick={() => setFilter('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'week'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📆 This Week
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏷 All
                </button>
              </div>
            </div>

            {/* Platform Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-primary focus:border-primary"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading contests...</p>
          </div>
        ) : contests.filter(contest => 
            contest.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No contests found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? `No contests match "${searchQuery}"` : 'There are no contests matching your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contests
              .filter(contest => contest.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(contest => (
              <div
                key={contest._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlatformColor(contest.platform)}`}>
                        {contest.platform}
                      </span>
                      {isToday(new Date(contest.startTime)) && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          TODAY
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {contest.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <span>🗓</span>
                        <span>{format(new Date(contest.startTime), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⏰</span>
                        <span>{format(new Date(contest.startTime), 'hh:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⌛</span>
                        <span>{contest.duration}</span>
                      </div>
                    </div>
                    <CountdownTimer startTime={contest.startTime} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={contest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                    >
                      Go to Contest →
                    </a>
                    <button
                      onClick={() => {
                        downloadICS(contest);
                        toast.success('📅 Calendar event downloaded!');
                      }}
                      className="px-6 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition"
                    >
                      📅 Add to Calendar
                    </button>
                    {user && (
                      <button
                        onClick={() => handleRemindMe(contest._id)}
                        disabled={hasReminder(contest._id)}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                          hasReminder(contest._id)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        {hasReminder(contest._id) ? '✓ Reminder Set' : '🔔 Remind Me'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
