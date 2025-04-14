import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getProjectById, getProjectTasks, updateTask, deleteTask, getUsers } from '../../utils/api';

const ProjectDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProjectData();
      fetchUsers();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await getProjectById(id);
      console.log('Project Response:', response);
      
      if (response.data && response.data.data) {
        const projectData = response.data.data;
        setProject(projectData);
        
        // Fetch tasks for this project
        try {
          // Get all tasks for this project
          const tasksResponse = await getProjectTasks(id);
          console.log('Tasks Response:', tasksResponse);
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
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id, taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task');
    }
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
        <title>{project?.name || 'Project Detail'} | UVW</title>
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks</h2>
            {tasks.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {tasks.map((task) => (
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
