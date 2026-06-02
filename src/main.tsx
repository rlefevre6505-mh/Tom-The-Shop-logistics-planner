import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store from "./app/store.ts";
import { Provider } from "react-redux";
import { fetchClashData } from "./features/ClashChecker/ClashCheckerSlice";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
);

// Polling for clash data every 2 seconds (guard to avoid duplicate intervals)
if (!window.__clashPollingStarted) {
  void store.dispatch(fetchClashData());
  setInterval(() => {
    void store.dispatch(fetchClashData());
  }, 2000);
  window.__clashPollingStarted = true;
}
