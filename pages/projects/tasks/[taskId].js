import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getTaskById, updateTask, deleteTask, getUsers } from '../../../utils/api';

const TaskDetail = () => {
  const router = useRouter();
  const { id, taskId } = router.query;
  
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'pending',
    priority: 'medium',
  });

  useEffect(() => {
    if (taskId) {
      const projectId = id || router.query.id;
      if (projectId) {
        fetchTask(projectId);
        fetchUsers();
      }
    }
  }, [taskId, id, router.query]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTask = async (projectId) => {
    try {
      const response = await getTaskById(projectId, taskId);
      
      if (response.data && response.data.data) {
        const taskData = response.data.data;
        setTask(taskData);
        
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          assignedTo: taskData.assignedTo?._id || '',
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
        });
      }
    } catch (err) {
      console.error('Error fetching task:', err);
      setError(err.response?.data?.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const projectId = id || router.query.id;

    try {
      const response = await updateTask(projectId, taskId, formData);
      if (response.data && response.data.data) {
        setTask(response.data.data);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    const projectId = id || router.query.id;

    try {
      await deleteTask(projectId, taskId);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task');
      setLoading(false);
    }
  };

  if (loading && !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{task?.title || 'Task Detail'} | batu</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => {
                const projectId = id || router.query.id;
                router.push(`/projects/${projectId}`);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Project
            </button>
            
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{task?.title}</h1>
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  required
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Task Details</h2>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task?.description || 'No description'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task?.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task?.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task?.status}
                      </span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task?.assignedTo?.name || 'Unassigned'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task?.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task?.priority}
                      </span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {task?.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetail; 