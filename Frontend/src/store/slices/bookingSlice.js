import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "../../services/bookingService";

// Async thunks
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookings(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking",
      );
    }
  },
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBookingStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status",
      );
    }
  },
);

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  stats: {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  },
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Booking Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking._id === action.payload._id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearError, setSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
