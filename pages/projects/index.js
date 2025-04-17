import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllProjects } from '../../utils/api';

const Projects = () => {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setProjectsList(response.data.data);
        } else {
          setProjectsList([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch projects');
        setProjectsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>Projects | UVW</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <button
            onClick={() => router.push('/projects/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Create Project
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {projectsList.length > 0 ? (
                projectsList.map((project) => (
                  <li key={project._id}>
                    <div 
                      className="block hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-blue-600 truncate">{project.name}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(project.status || 'Planned')}`}>
                              {project.status || 'Planned'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Created by: {project.createdBy?.name || 'Unknown'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created: {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No projects found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
