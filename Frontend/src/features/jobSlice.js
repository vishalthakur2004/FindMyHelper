import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobService } from "../services/jobService";

// Async thunks for job operations
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const result = await jobService.createJob(jobData);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchNearbyJobs = createAsyncThunk(
  "jobs/fetchNearbyJobs",
  async (filters, { rejectWithValue }) => {
    try {
      const result = await jobService.getNearbyJobs(filters);
      if (result.success) {
        return { jobs: result.data, pagination: result.pagination };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMyJobPosts = createAsyncThunk(
  "jobs/fetchMyJobPosts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await jobService.getMyJobPosts();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const result = await jobService.getJobById(jobId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const result = await jobService.applyForJob(jobId, applicationData);
      if (result.success) {
        return { jobId, application: result.data };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const result = await jobService.deleteJobPost(jobId);
      if (result.success) {
        return jobId;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  nearbyJobs: [],
  myJobPosts: [],
  currentJob: null,
  pagination: null,
  loading: {
    nearbyJobs: false,
    myJobPosts: false,
    currentJob: false,
    creating: false,
    applying: false,
    deleting: false,
  },
  error: {
    nearbyJobs: null,
    myJobPosts: null,
    currentJob: null,
    creating: null,
    applying: null,
    deleting: null,
  },
  filters: {
    location: "",
    budget: { min: "", max: "" },
    serviceCategory: "",
    sortBy: "newest",
    urgency: "",
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearErrors: (state) => {
      state.error = {
        nearbyJobs: null,
        myJobPosts: null,
        currentJob: null,
        creating: null,
        applying: null,
        deleting: null,
      };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    resetJobState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.myJobPosts.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload;
      });

    // Fetch Nearby Jobs
    builder
      .addCase(fetchNearbyJobs.pending, (state) => {
        state.loading.nearbyJobs = true;
        state.error.nearbyJobs = null;
      })
      .addCase(fetchNearbyJobs.fulfilled, (state, action) => {
        state.loading.nearbyJobs = false;
        state.nearbyJobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNearbyJobs.rejected, (state, action) => {
        state.loading.nearbyJobs = false;
        state.error.nearbyJobs = action.payload;
      });

    // Fetch My Job Posts
    builder
      .addCase(fetchMyJobPosts.pending, (state) => {
        state.loading.myJobPosts = true;
        state.error.myJobPosts = null;
      })
      .addCase(fetchMyJobPosts.fulfilled, (state, action) => {
        state.loading.myJobPosts = false;
        state.myJobPosts = action.payload;
      })
      .addCase(fetchMyJobPosts.rejected, (state, action) => {
        state.loading.myJobPosts = false;
        state.error.myJobPosts = action.payload;
      });

    // Fetch Job By ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.loading.currentJob = true;
        state.error.currentJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading.currentJob = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading.currentJob = false;
        state.error.currentJob = action.payload;
      });

    // Apply for Job
    builder
      .addCase(applyForJob.pending, (state) => {
        state.loading.applying = true;
        state.error.applying = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading.applying = false;
        // Update the job in nearbyJobs to show application status
        const jobIndex = state.nearbyJobs.findIndex(
          (job) => job._id === action.payload.jobId,
        );
        if (jobIndex !== -1) {
          state.nearbyJobs[jobIndex].hasApplied = true;
        }
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading.applying = false;
        state.error.applying = action.payload;
      });

    // Delete Job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.myJobPosts = state.myJobPosts.filter(
          (job) => job._id !== action.payload,
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload;
      });
  },
});

export const { setFilters, clearErrors, clearCurrentJob, resetJobState } =
  jobSlice.actions;

export default jobSlice.reducer;