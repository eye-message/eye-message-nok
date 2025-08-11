import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Notification from "./pages/Notification";
import Board from "./pages/Board";
import Add from "./pages/Add";
import CalendarPage from "./pages/CalendarPage";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Layout from "./pages/Layout";

import "./styles/App.css";
import Signup from "./pages/Signup";
import MessageAddForm from "./pages/MessageAddForm";
import MessageList from "./pages/MessageList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          {/* <Route index element={<Navigate to="/notification" replace />} /> */}
          <Route path="/notification" element={<Notification />} />
          <Route path="/board" element={<Board />} />
          <Route path="/list" element={<MessageList />} />
          <Route path="/add" element={<MessageAddForm />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
