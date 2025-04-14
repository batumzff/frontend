// store/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../utils/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Failed to fetch projects' }
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProjectById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Failed to fetch project details' }
      );
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await updateProject(id, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projectList: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projectList = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch projects';
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch project';
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projectList.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projectList.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projectList[index] = action.payload;
        }
        if (state.currentProject && state.currentProject._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projectList = state.projectList.filter(p => p._id !== action.payload);
        if (state.currentProject && state.currentProject._id === action.payload) {
          state.currentProject = null;
        }
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;