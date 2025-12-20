import React, { useState, useEffect } from 'react';
import { format, isToday, isThisWeek, isPast } from 'date-fns';
import { contestsAPI, remindersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import { downloadICS, getCalendarUrls } from '../utils/calendar';

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('week'); // 'today', 'week', 'all'
  const [platformFilter, setPlatformFilter] = useState('all');
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarDropdown, setCalendarDropdown] = useState(null); // Track which contest's dropdown is open

  const { user } = useAuth();

  const platforms = ['all', 'Codeforces', 'CodeChef', 'LeetCode', 'AtCoder', 'HackerRank', 'HackerEarth'];

  useEffect(() => {
    loadContests();
    if (user) {
      loadReminders();
    }
  }, [filter, platformFilter, user]);

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
      setReminders(response.data || []);
    } catch (error) {
      console.error('Failed to load reminders:', error);
      setReminders([]); // Set empty array on error to prevent crashes
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
    if (!Array.isArray(reminders)) return false;
    
    return reminders.some(r => {
      if (!r || !r.contestId) return false;
      // Handle both populated and non-populated contestId
      const rContestId = typeof r.contestId === 'object' ? r.contestId._id : r.contestId;
      return rContestId === contestId;
    });
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Time Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Filter
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('today')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm ${
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
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-primary focus:border-primary"
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
                className="contest-card bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-4 sm:p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getPlatformColor(contest.platform)}`}>
                        {contest.platform}
                      </span>
                      {isToday(new Date(contest.startTime)) && (
                        <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          TODAY
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{contest.name}</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-300">
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
                      className="px-4 sm:px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition text-center text-sm sm:text-base"
                    >
                      Go to Contest →
                    </a>
                    
                    {/* Calendar Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setCalendarDropdown(calendarDropdown === contest._id ? null : contest._id)}
                        className="px-6 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition flex items-center gap-2"
                      >
                        📅 Add to Calendar
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {calendarDropdown === contest._id && (
                        <div className="absolute z-10 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="py-1">
                            <a
                              href={getCalendarUrls(contest).google}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setCalendarDropdown(null);
                                toast.success('Opening Google Calendar...');
                              }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Google Calendar
                            </a>
                            <a
                              href={getCalendarUrls(contest).outlook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setCalendarDropdown(null);
                                toast.success('Opening Outlook Calendar...');
                              }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4">
                                <path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm5 3c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                              </svg>
                              Outlook Calendar
                            </a>
                            <a
                              href={getCalendarUrls(contest).office365}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setCalendarDropdown(null);
                                toast.success('Opening Office 365 Calendar...');
                              }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#D83B01">
                                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h6v2H9V8zm0 3h6v2H9v-2zm0 3h6v2H9v-2z"/>
                              </svg>
                              Office 365
                            </a>
                            <button
                              onClick={() => {
                                downloadICS(contest);
                                setCalendarDropdown(null);
                                toast.success('📅 Calendar file downloaded!');
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download .ics file
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
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
