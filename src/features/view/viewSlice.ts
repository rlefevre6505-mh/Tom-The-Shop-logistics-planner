import { createSlice } from "@reduxjs/toolkit";

interface viewState {
  value: string;
}

const initialState: viewState = {
  value: "calendar",
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    changeView: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeView } = viewSlice.actions;

export default viewSlice.reducer;
