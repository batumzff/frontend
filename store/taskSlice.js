// store/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjectTasks, getTaskById, createTask, updateTask, deleteTask } from '../utils/api';

export const fetchProjectTasks = createAsyncThunk(
  'tasks/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getProjectTasks(projectId);
      return { projectId, tasks: response.data.data || response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Failed to fetch tasks' }
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTaskById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const response = await createTask(projectId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await updateTask(projectId, taskId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await deleteTask(projectId, taskId);
      return { projectId, taskId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Delete failed' });
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasksByProject: {},
    currentTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksByProject[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch task';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const projectId = action.payload.project;
        if (state.tasksByProject[projectId]) {
          state.tasksByProject[projectId].push(action.payload);
        }
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const projectId = action.payload.project;
        if (state.tasksByProject[projectId]) {
          const index = state.tasksByProject[projectId].findIndex(t => t._id === action.payload._id);
          if (index !== -1) {
            state.tasksByProject[projectId][index] = action.payload;
          }
        }
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const { projectId, taskId } = action.payload;
        if (state.tasksByProject[projectId]) {
          state.tasksByProject[projectId] = state.tasksByProject[projectId].filter(t => t._id !== taskId);
        }
        if (state.currentTask && state.currentTask._id === taskId) {
          state.currentTask = null;
        }
      });
  },
});

export const { clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;