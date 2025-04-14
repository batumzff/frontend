// components/tasks/TaskCard.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeTask, editTask } from '../../store/taskSlice';

const TaskCard = ({ task, showProjectName = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await dispatch(removeTask(task._id));
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await dispatch(editTask({
      id: task._id,
      taskData: { status: newStatus }
    }));
    setIsUpdating(false);
  };

  // Get priority and status styling
  const getPriorityStyle = () => {
    switch(task.priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStyle = () => {
    switch(task.status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 mr-2">
              {task.title}
            </h3>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityStyle()}`}>
              {task.priority}
            </span>
          </div>
          <div>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle()}`}>
              {task.status}
            </span>
          </div>
        </div>

        {showProjectName && task.project && (
          <div className="mt-2 text-sm text-gray-500">
            Project: {typeof task.project === 'object' ? task.project.name : 'Unknown project'}
          </div>
        )}

        <div className="mt-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-500">{task.description}</p>
            
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Assigned To:</span> {task.assignedTo?.name || 'Unassigned'}
              </p>
              {task.createdAt && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Created:</span> {formatDate(task.createdAt)}
                </p>
              )}
              {task.updatedAt && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Last Updated:</span> {formatDate(task.updatedAt)}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              {task.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Mark Complete
                </button>
              )}
              
              {task.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Progress
                </button>
              )}
              
              {task.status === 'in-progress' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('pending')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Move to Pending
                </button>
              )}
              
              {task.status === 'completed' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reopen
                </button>
              )}
              
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;