import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getProjectById, getProjectTasks, updateTask, deleteTask, getUsers } from '../../utils/api';
import Notification from '../../components/common/Notification';
import { showNotification } from '../../store/notificationSlice';
import { useDispatch } from 'react-redux';

const ProjectDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      fetchProjectData();
      fetchUsers();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await getProjectById(id);
      
      if (response.data && response.data.data) {
        const projectData = response.data.data;
        setProject(projectData);
        
        // Fetch tasks for this project
        try {
          // Get all tasks for this project
          const tasksResponse = await getProjectTasks(id);
          if (tasksResponse.data && tasksResponse.data.data) {
            // Ensure we handle both array and single object responses
            const tasksData = Array.isArray(tasksResponse.data.data) 
              ? tasksResponse.data.data 
              : [tasksResponse.data.data];
            setTasks(tasksData);
          }
        } catch (taskErr) {
          console.error('Error fetching tasks:', taskErr);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const response = await updateTask(id, taskId, updatedData);
      if (response.data && response.data.data) {
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data.data : task
        ));
        dispatch(showNotification({
          message: 'Task successfully updated!',
          type: 'success'
        }));
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task');
      dispatch(showNotification({
        message: 'Failed to update task',
        type: 'error'
      }));
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id, taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      dispatch(showNotification({
        message: 'Task successfully deleted!',
        type: 'success'
      }));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task');
      dispatch(showNotification({
        message: 'Failed to delete task',
        type: 'error'
      }));
    }
  };

  const getSortedAndFilteredTasks = () => {
    let filteredTasks = [...tasks];
    
    // Filter by status
    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }
    
    // Sort tasks
    return filteredTasks.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  if (loading && !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !project) {
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
        <title>{project?.name || 'Project Detail'} | batu</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => router.push('/projects')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Projects
            </button>
            
            
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                  <button
                    onClick={() => router.push(`/projects/tasks/new?id=${id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Task
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project?.description}</dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
            {getSortedAndFilteredTasks().length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {getSortedAndFilteredTasks().map((task) => (
                    <li key={task._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {task.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {task.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Assigned to: {task.assignedTo?.name || 'Unassigned'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/projects/tasks/${task._id}?id=${id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleTaskDelete(task._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No tasks found for this project.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
