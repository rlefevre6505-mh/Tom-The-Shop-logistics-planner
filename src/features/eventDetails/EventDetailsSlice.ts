import { createSlice } from "@reduxjs/toolkit";

type shop = {
  id: number;
  shop_name: string;
};

type vehicle = {
  id: number;
  vehicle_name: string;
  vehicle_reg: string;
};

type eventDetailsObject = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  date_added: Date;
  location?: string;
  num_of_shops?: number;
  shops?: shop[];
  num_of_vehicles?: number;
  vehicles?: vehicle[];
};

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
