import React, { useState, useEffect } from 'react';
import { contestsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AdminPanel = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Codeforces',
    startTime: '',
    duration: '',
    link: '',
    tags: ''
  });

  const platforms = ['Codeforces', 'CodeChef', 'LeetCode', 'AtCoder', 'HackerRank', 'HackerEarth', 'TopCoder', 'Other'];

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getAll({ timeFilter: 'all' });
      setContests(response.data);
    } catch (error) {
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      if (editingContest) {
        await contestsAPI.update(editingContest._id, data);
        toast.success('Contest updated successfully!');
      } else {
        await contestsAPI.create(data);
        toast.success('Contest created successfully!');
      }

      setShowModal(false);
      setEditingContest(null);
      setFormData({
        name: '',
        platform: 'Codeforces',
        startTime: '',
        duration: '',
        link: '',
        tags: ''
      });
      loadContests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (contest) => {
    setEditingContest(contest);
    setFormData({
      name: contest.name,
      platform: contest.platform,
      startTime: format(new Date(contest.startTime), "yyyy-MM-dd'T'HH:mm"),
      duration: contest.duration,
      link: contest.link,
      tags: contest.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) {
      return;
    }

    try {
      await contestsAPI.delete(id);
      toast.success('Contest deleted successfully!');
      loadContests();
    } catch (error) {
      toast.error('Failed to delete contest');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await contestsAPI.markCompleted(id);
      toast.success('Contest marked as completed!');
      loadContests();
    } catch (error) {
      toast.error('Failed to mark contest as completed');
    }
  };

  const openAddModal = () => {
    setEditingContest(null);
    setFormData({
      name: '',
      platform: 'Codeforces',
      startTime: '',
      duration: '',
      link: '',
      tags: ''
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Panel 👨‍💼
            </h1>
            <p className="text-gray-600">
              Manage coding contests
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            ➕ Add Contest
          </button>
        </div>

        {/* Contests Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contests.map(contest => (
                    <tr key={contest._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contest.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {contest.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {format(new Date(contest.startTime), 'MMM dd, yyyy hh:mm a')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contest.duration}
                      </td>
                      <td className="px-6 py-4">
                        {contest.isCompleted ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Upcoming
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(contest)}
                          className="text-primary hover:text-blue-700"
                        >
                          Edit
                        </button>
                        {!contest.isCompleted && (
                          <button
                            onClick={() => handleMarkCompleted(contest._id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(contest._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingContest ? 'Edit Contest' : 'Add New Contest'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contest Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Codeforces Round 912"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    required
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., 2 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contest Link *
                  </label>
                  <input
                    type="url"
                    name="link"
                    required
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Div 2, Weekly"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingContest ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
