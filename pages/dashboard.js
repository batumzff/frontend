import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllProjects } from '../utils/api';

const Dashboard = () => {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        if (response.data && response.data.data) {
          setProjectsList(response.data.data);
        } else {
          setProjectsList([]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | UVW</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/projects')}
          >
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600">Manage your projects</p>
            {!loading && (
              <p className="mt-2 text-sm text-gray-500">
                {projectsList.length} active projects
              </p>
            )}
          </div>
          
          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
