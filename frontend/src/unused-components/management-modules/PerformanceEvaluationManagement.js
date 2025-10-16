import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './DataStates';
import { Card, DataCard } from './DataStates';

function PerformanceEvaluationManagement() {
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newReview, setNewReview] = useState({
    employeeId: '',
    reviewPeriod: new Date().getFullYear().toString(),
    reviewType: 'annual',
    reviewDate: new Date().toISOString().split('T')[0],
    goals: [
      { category: 'Performance', weight: 40, target: '', achievement: '', score: 0 },
      { category: 'Quality', weight: 30, target: '', achievement: '', score: 0 },
      { category: 'Teamwork', weight: 20, target: '', achievement: '', score: 0 },
      { category: 'Development', weight: 10, target: '', achievement: '', score: 0 }
    ],
    strengths: '',
    areasForImprovement: '',
    developmentPlan: '',
    managerComments: '',
    employeeComments: '',
    overallRating: 0,
    status: 'pending',
    nextReviewDate: ''
  });

  const fetchPerformanceReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/manpower/performance-reviews', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          period: periodFilter !== 'all' ? periodFilter : undefined
        }
      });
      setPerformanceReviews(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      setError('Failed to fetch performance reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/manpower', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchPerformanceReviews();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, periodFilter]);

  const calculateOverallScore = (goals) => {
    const totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0);
    const weightedScore = goals.reduce((sum, goal) => sum + (goal.score * goal.weight), 0);
    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) / 100 : 0;
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...newReview.goals];
    updatedGoals[index][field] = field === 'score' || field === 'weight' ? parseFloat(value) || 0 : value;
    
    const overallRating = calculateOverallScore(updatedGoals);
    
    setNewReview(prev => ({
      ...prev,
      goals: updatedGoals,
      overallRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        ...newReview,
        id: `REV-${Date.now()}`,
        createdDate: new Date().toISOString()
      };

      if (selectedReview) {
        await axios.put(`http://localhost:5001/api/manpower/performance-reviews/${selectedReview.id}`, reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5001/api/manpower/performance-reviews', reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowForm(false);
      setSelectedReview(null);
      resetForm();
      fetchPerformanceReviews();
    } catch (error) {
      console.error('Error saving performance review:', error);
      setError('Failed to save performance review');
    }
  };

  const resetForm = () => {
    setNewReview({
      employeeId: '',
      reviewPeriod: new Date().getFullYear().toString(),
      reviewType: 'annual',
      reviewDate: new Date().toISOString().split('T')[0],
      goals: [
        { category: 'Performance', weight: 40, target: '', achievement: '', score: 0 },
        { category: 'Quality', weight: 30, target: '', achievement: '', score: 0 },
        { category: 'Teamwork', weight: 20, target: '', achievement: '', score: 0 },
        { category: 'Development', weight: 10, target: '', achievement: '', score: 0 }
      ],
      strengths: '',
      areasForImprovement: '',
      developmentPlan: '',
      managerComments: '',
      employeeComments: '',
      overallRating: 0,
      status: 'pending',
      nextReviewDate: ''
    });
  };

  const editReview = (review) => {
    setSelectedReview(review);
    setNewReview(review);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : employeeId;
  };

  // Calculate statistics
  const totalReviews = performanceReviews.length;
  const completedReviews = performanceReviews.filter(review => review.status === 'completed').length;
  const pendingReviews = performanceReviews.filter(review => review.status === 'pending').length;
  const avgRating = performanceReviews.length > 0 
    ? performanceReviews.reduce((sum, review) => sum + (review.overallRating || 0), 0) / performanceReviews.length
    : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={fetchPerformanceReviews}
            className="mt-2 bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Evaluation Management</h1>
          <p className="text-gray-600">Manage employee performance reviews and evaluations</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Review
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DataCard
          title="Total Reviews"
          value={totalReviews}
          icon="📊"
          color="bg-blue-50 border-blue-200"
        />
        <DataCard
          title="Completed"
          value={completedReviews}
          icon="✅"
          color="bg-green-50 border-green-200"
        />
        <DataCard
          title="Pending"
          value={pendingReviews}
          icon="⏳"
          color="bg-yellow-50 border-yellow-200"
        />
        <DataCard
          title="Avg Rating"
          value={avgRating.toFixed(1)}
          icon="⭐"
          color="bg-purple-50 border-purple-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Periods</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {performanceReviews.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No performance reviews found</p>
          </Card>
        ) : (
          performanceReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getEmployeeName(review.employeeId)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {review.reviewType.charAt(0).toUpperCase() + review.reviewType.slice(1)} Review - {review.reviewPeriod}
                  </p>
                  <p className="text-sm text-gray-600">
                    Review Date: {new Date(review.reviewDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                    {review.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`text-lg font-bold ${getRatingColor(review.overallRating)}`}>
                    {review.overallRating}/5.0
                  </span>
                  <Button
                    onClick={() => editReview(review)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Button>
                </div>
              </div>

              {/* Goals Summary */}
              {review.goals && review.goals.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Goals:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {review.goals.map((goal, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{goal.category}</span>
                          <span className="text-sm text-gray-600">{goal.weight}%</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">Score: {goal.score}/5.0</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(goal.score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {review.strengths && (
                  <div>
                    <p className="font-medium text-gray-700">Strengths:</p>
                    <p className="text-gray-600">{review.strengths}</p>
                  </div>
                )}
                {review.areasForImprovement && (
                  <div>
                    <p className="font-medium text-gray-700">Areas for Improvement:</p>
                    <p className="text-gray-600">{review.areasForImprovement}</p>
                  </div>
                )}
              </div>

              {review.nextReviewDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Next Review: {new Date(review.nextReviewDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReview ? 'Edit Performance Review' : 'Create Performance Review'}
                </h2>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedReview(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee *
                    </label>
                    <select
                      value={newReview.employeeId}
                      onChange={(e) => setNewReview(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Period *
                    </label>
                    <input
                      type="text"
                      value={newReview.reviewPeriod}
                      onChange={(e) => setNewReview(prev => ({ ...prev, reviewPeriod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Type *
                    </label>
                    <select
                      value={newReview.reviewType}
                      onChange={(e) => setNewReview(prev => ({ ...prev, reviewType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="annual">Annual</option>
                      <option value="mid-year">Mid-Year</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="probation">Probation</option>
                    </select>
                  </div>
                </div>

                {/* Performance Goals */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Goals</h3>
                  <div className="space-y-4">
                    {newReview.goals.map((goal, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <input
                              type="text"
                              value={goal.category}
                              onChange={(e) => handleGoalChange(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Weight (%)
                            </label>
                            <input
                              type="number"
                              value={goal.weight}
                              onChange={(e) => handleGoalChange(index, 'weight', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Target
                            </label>
                            <input
                              type="text"
                              value={goal.target}
                              onChange={(e) => handleGoalChange(index, 'target', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Achievement
                            </label>
                            <input
                              type="text"
                              value={goal.achievement}
                              onChange={(e) => handleGoalChange(index, 'achievement', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Score (1-5)
                            </label>
                            <input
                              type="number"
                              value={goal.score}
                              onChange={(e) => handleGoalChange(index, 'score', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                              max="5"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Overall Rating: {newReview.overallRating}/5.0
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strengths
                    </label>
                    <textarea
                      value={newReview.strengths}
                      onChange={(e) => setNewReview(prev => ({ ...prev, strengths: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Areas for Improvement
                    </label>
                    <textarea
                      value={newReview.areasForImprovement}
                      onChange={(e) => setNewReview(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Development Plan
                  </label>
                  <textarea
                    value={newReview.developmentPlan}
                    onChange={(e) => setNewReview(prev => ({ ...prev, developmentPlan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Comments
                    </label>
                    <textarea
                      value={newReview.managerComments}
                      onChange={(e) => setNewReview(prev => ({ ...prev, managerComments: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Comments
                    </label>
                    <textarea
                      value={newReview.employeeComments}
                      onChange={(e) => setNewReview(prev => ({ ...prev, employeeComments: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Status
                    </label>
                    <select
                      value={newReview.status}
                      onChange={(e) => setNewReview(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Review Date
                    </label>
                    <input
                      type="date"
                      value={newReview.nextReviewDate}
                      onChange={(e) => setNewReview(prev => ({ ...prev, nextReviewDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedReview(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {selectedReview ? 'Update Review' : 'Create Review'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceEvaluationManagement;
