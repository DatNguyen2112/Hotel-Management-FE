import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "../src/help/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { StyledEngineProvider } from "@mui/styled-engine";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <StyledEngineProvider>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </StyledEngineProvider>
  </BrowserRouter>
);
