import { createSlice } from "@reduxjs/toolkit";

interface selectedEventState {
  value: number | null;
}

const initialState: selectedEventState = {
  value: null,
};

export const SelectedEventSlice = createSlice({
  name: "SelectedEvent",
  initialState,
  reducers: {
    changeSelectedEvent: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeSelectedEvent } = SelectedEventSlice.actions;

export default SelectedEventSlice.reducer;
