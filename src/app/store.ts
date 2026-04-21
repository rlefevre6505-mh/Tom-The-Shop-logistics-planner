import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "../features/view/viewSlice.ts";
import SelectedEventReducer from "../features/selectedEvent/SelectedEventSlice.ts";

export const store = configureStore({
  reducer: {
    view: viewReducer,
    selectedEvent: SelectedEventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
