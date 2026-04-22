import { createSlice } from "@reduxjs/toolkit";

type eventDetailsObject = {
  title: string;
  start: Date;
  end: Date;
  date_added?: Date;
  num_of_shops?: number;
  location?: string;
};

interface EventDetailsState {
  // TODO: change to eventDetailsObject once complete
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
