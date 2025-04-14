// components/projects/ProjectCard.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeProject } from '../../store/projectSlice';
import Link from 'next/link';

const ProjectCard = ({ project }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      setIsDeleting(true);
      await dispatch(removeProject(project._id));
      setIsDeleting(false);
    }
  };

  // Count tasks by status
  const getTaskCounts = () => {
    if (!project.tasks) return { pending: 0, inProgress: 0, completed: 0 };
    
    return {
      pending: project.tasks.filter(task => task.status === 'pending').length,
      inProgress: project.tasks.filter(task => task.status === 'in-progress').length,
      completed: project.tasks.filter(task => task.status === 'completed').length
    };
  };

  const taskCounts = getTaskCounts();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{project.name}</h3>
          <div className="flex space-x-2">
            <Link 
              href={`/projects/${project._id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{project.description}</p>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-md px-3 py-2">
            <span className="text-xs font-medium text-yellow-800">Pending</span>
            <p className="mt-1 text-lg font-semibold">{taskCounts.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-md px-3 py-2">
            <span className="text-xs font-medium text-blue-800">In Progress</span>
            <p className="mt-1 text-lg font-semibold">{taskCounts.inProgress}</p>
          </div>
          <div className="bg-green-50 rounded-md px-3 py-2">
            <span className="text-xs font-medium text-green-800">Completed</span>
            <p className="mt-1 text-lg font-semibold">{taskCounts.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;