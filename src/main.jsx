import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Notification from "./pages/Notification";
import Board from "./pages/Board";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MessageAddForm from "./pages/MessageAddForm";
import MessageList from "./pages/MessageList";
import DiaryCalendar from "./pages/DiaryCalendar";
import DiaryMain from "./pages/DiaryMain";
import DiaryForm from "./pages/DiaryForm";
import DiaryDetail from "./pages/DiaryDetail";
import OAuthCallback from "./components/OAuthCallback";
import MobileWrapper from "./pages/MobileWrapper";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <MobileWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          <Route element={<Layout />}>
            <Route path="/notification" element={<Notification />} />
            <Route path="/board" element={<Board />} />
            <Route path="/list" element={<MessageList />} />
            <Route path="/add" element={<MessageAddForm />} />
            <Route path="/diary" element={<DiaryMain />}>
              <Route index element={<DiaryCalendar />} />
              <Route path="form" element={<DiaryForm />} />
              <Route path="detail" element={<DiaryDetail />} />
            </Route>
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </MobileWrapper>
    </Router>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
