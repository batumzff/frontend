import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProjectForm from '../../components/projects/ProjectForm';

const NewProject = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/projects');
  };

  return (
    <>
      <Head>
        <title>Create New Project | batu</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
            
            <h1 className="text-2xl font-bold">Create New Project</h1>
          </div>
          
          <ProjectForm 
            onCancel={() => router.push('/projects')} 
            onSuccess={handleSuccess} 
          />
        </div>
      </div>
    </>
  );
};

export default NewProject; 