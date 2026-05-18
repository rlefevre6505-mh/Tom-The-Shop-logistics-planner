import { createSlice } from "@reduxjs/toolkit";

interface editingViewState {
  value: string;
}

const initialState: editingViewState = {
  value: "",
};

export const editingViewSlice = createSlice({
  name: "editingView",
  initialState,
  reducers: {
    changeEditingView: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeEditingView } = editingViewSlice.actions;

export default editingViewSlice.reducer;
