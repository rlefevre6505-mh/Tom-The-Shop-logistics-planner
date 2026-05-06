import { createSlice } from "@reduxjs/toolkit";
import type { eventDetailsObject } from "../../lib/types";

interface EventDetailsState {
  value: null | eventDetailsObject;
}

const initialState: EventDetailsState = {
  value: null,
};

export const EventDetailsSlice = createSlice({
  name: "EventDetails",
  initialState,
  reducers: {
    changeEventDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeEventDetails } = EventDetailsSlice.actions;

export default EventDetailsSlice.reducer;
