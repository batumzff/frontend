// components/projects/ProjectList.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/projectSlice';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

const ProjectList = () => {
  const [showForm, setShowForm] = useState(false);
  const { projectList, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateSuccess = () => {
    setShowForm(false);
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl leading-6 font-medium text-gray-900">Projects</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showForm ? 'Cancel' : 'Create New Project'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6">
          <ProjectForm onCancel={() => setShowForm(false)} onSuccess={handleCreateSuccess} />
        </div>
      )}

      {loading && <p className="text-center py-4">Loading projects...</p>}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mt-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {!loading && !error && projectList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No projects found. Create your first project to get started!</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;