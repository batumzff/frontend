// components/tasks/TaskList.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTasks, editTask, removeTask } from '../../store/taskSlice';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const TaskList = ({ projectId, showProjectName = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { tasksByProject, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId]);

  const tasks = tasksByProject[projectId] || [];

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(editTask({ id: taskId, taskData: { status: newStatus } }));
  };

  const handlePriorityChange = (taskId, newPriority) => {
    dispatch(editTask({ id: taskId, taskData: { priority: newPriority } }));
  };

  const handleDelete = (taskId) => {
    dispatch(removeTask(taskId));
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          projectId={projectId}
          onCancel={() => setShowForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <div className="flex space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks
            .filter((task) => statusFilter === 'all' || task.status === statusFilter)
            .filter((task) => priorityFilter === 'all' || task.priority === priorityFilter)
            .map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                showProjectName={showProjectName}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
