import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "../services/bookingService";

// Async thunks for booking operations
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const result = await bookingService.createBookingRequest(bookingData);
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

export const fetchNearbyWorkers = createAsyncThunk(
  "bookings/fetchNearbyWorkers",
  async (filters, { rejectWithValue }) => {
    try {
      const result = await bookingService.getNearbyWorkers(filters);
      if (result.success) {
        return { workers: result.data, pagination: result.pagination };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchWorkerBookings = createAsyncThunk(
  "bookings/fetchWorkerBookings",
  async (status, { rejectWithValue }) => {
    try {
      const result = await bookingService.getWorkerBookings(status);
      if (result.success) {
        return { bookings: result.data, stats: result.stats };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCustomerBookings = createAsyncThunk(
  "bookings/fetchCustomerBookings",
  async (status, { rejectWithValue }) => {
    try {
      const result = await bookingService.getCustomerBookings(status);
      if (result.success) {
        return { bookings: result.data, stats: result.stats };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const result = await bookingService.getBookingById(bookingId);
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

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status, feedback }, { rejectWithValue }) => {
    try {
      const result = await bookingService.updateBookingStatus(
        bookingId,
        status,
        feedback,
      );
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

const initialState = {
  nearbyWorkers: [],
  workerBookings: [],
  customerBookings: [],
  currentBooking: null,
  pagination: null,
  stats: null,
  loading: {
    nearbyWorkers: false,
    workerBookings: false,
    customerBookings: false,
    currentBooking: false,
    creating: false,
    updating: false,
  },
  error: {
    nearbyWorkers: null,
    workerBookings: null,
    customerBookings: null,
    currentBooking: null,
    creating: null,
    updating: null,
  },
  filters: {
    location: "",
    serviceCategory: "",
    radius: 10,
    rating: 0,
    sortBy: "distance",
  },
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearErrors: (state) => {
      state.error = {
        nearbyWorkers: null,
        workerBookings: null,
        customerBookings: null,
        currentBooking: null,
        creating: null,
        updating: null,
      };
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    resetBookingState: (state) => {
      return initialState;
    },
    updateBookingInList: (state, action) => {
      const updatedBooking = action.payload;

      // Update in worker bookings
      const workerIndex = state.workerBookings.findIndex(
        (b) => b._id === updatedBooking._id,
      );
      if (workerIndex !== -1) {
        state.workerBookings[workerIndex] = updatedBooking;
      }

      // Update in customer bookings
      const customerIndex = state.customerBookings.findIndex(
        (b) => b._id === updatedBooking._id,
      );
      if (customerIndex !== -1) {
        state.customerBookings[customerIndex] = updatedBooking;
      }

      // Update current booking if it's the same
      if (
        state.currentBooking &&
        state.currentBooking._id === updatedBooking._id
      ) {
        state.currentBooking = updatedBooking;
      }
    },
  },
  extraReducers: (builder) => {
    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.customerBookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload;
      });

    // Fetch Nearby Workers
    builder
      .addCase(fetchNearbyWorkers.pending, (state) => {
        state.loading.nearbyWorkers = true;
        state.error.nearbyWorkers = null;
      })
      .addCase(fetchNearbyWorkers.fulfilled, (state, action) => {
        state.loading.nearbyWorkers = false;
        state.nearbyWorkers = action.payload.workers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNearbyWorkers.rejected, (state, action) => {
        state.loading.nearbyWorkers = false;
        state.error.nearbyWorkers = action.payload;
      });

    // Fetch Worker Bookings
    builder
      .addCase(fetchWorkerBookings.pending, (state) => {
        state.loading.workerBookings = true;
        state.error.workerBookings = null;
      })
      .addCase(fetchWorkerBookings.fulfilled, (state, action) => {
        state.loading.workerBookings = false;
        state.workerBookings = action.payload.bookings;
        state.stats = action.payload.stats;
      })
      .addCase(fetchWorkerBookings.rejected, (state, action) => {
        state.loading.workerBookings = false;
        state.error.workerBookings = action.payload;
      });

    // Fetch Customer Bookings
    builder
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.loading.customerBookings = true;
        state.error.customerBookings = null;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action) => {
        state.loading.customerBookings = false;
        state.customerBookings = action.payload.bookings;
        state.stats = action.payload.stats;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.loading.customerBookings = false;
        state.error.customerBookings = action.payload;
      });

    // Fetch Booking By ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading.currentBooking = true;
        state.error.currentBooking = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading.currentBooking = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading.currentBooking = false;
        state.error.currentBooking = action.payload;
      });

    // Update Booking Status
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading.updating = false;
        bookingSlice.caseReducers.updateBookingInList(state, action);
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload;
      });
  },
});

export const {
  setFilters,
  clearErrors,
  clearCurrentBooking,
  resetBookingState,
  updateBookingInList,
} = bookingSlice.actions;

export default bookingSlice.reducer;