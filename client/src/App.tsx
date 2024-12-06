import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LinearProgress, CircularProgress } from "@mui/material";
import axios from "axios";

import SideBar from "./components/sidebar.component";
import Auth from "./components/auth.component";
import AppLayout from "./components/app.component";

process.env.NODE_ENV === "production"
  ? require("./App.min.css")
  : require("./App.css");

// eslint-disable-next-line
export default function App() {
  const [mails, setMails] = useState<any>([]);

  const [properties, setProperties] = useState<any>({
    action: 0,
    activeTab: window.localStorage.getItem("tab-session") ?? "home",
    history: [window.localStorage.getItem("tab-session") ?? "home"],
  });

  const [auth, setAuth] = useState<{
    isLoading: boolean;
    loggedIn: boolean;
  }>({
    isLoading: false,
    loggedIn: false,
  });

  useEffect(() => {
    const { isLoading, loggedIn } = auth;

    if (!isLoading) {
      if (!loggedIn && !window.location.pathname.startsWith("/auth"))
        // eslint-disable-next-line no-restricted-globals
        location.href = "/auth";
      else if (loggedIn && window.location.pathname.startsWith("/auth"))
        // eslint-disable-next-line no-restricted-globals
        location.href = "/";
    }
  }, [auth]);

  const handleCredential = useCallback((a: any) => {
    if (a.id && a.value) setAuth({ ...auth, [a.id]: a.value });
    else setAuth(a);
  }, []);

  const handleChange = useCallback(
    (a: any) => {
      if (a.goForward || a.goBackward)
        setProperties({
          ...properties,
          action: a.goBackward ? properties.action - 1 : properties.action + 1,
          [a.id]: a.value,
        });
      else {
        properties.history.splice(
          properties.action + 1,
          properties.history.length - (properties.action + 1),
          a.value
        );
        setProperties({
          ...properties,
          action: properties.action + 1,
          [a.id]: a.value,
        });
      }
      window.localStorage.setItem("tab-session", a.value);
    },
    [properties]
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            auth.loggedIn ? (
              <div>
                <SideBar properties={properties} handleChange={handleChange} />
                <AppLayout
                  auth={auth}
                  properties={properties}
                  handleChange={handleChange}
                />
              </div>
            ) : (
              <div>
                <LinearProgress />
                <div className="backdrop-overlay"></div>
                <div className="backdrop">
                  <div className="acrylic-material"></div>
                  <div className="backdrop-image" id="backdrop-image"></div>
                </div>
                <div className="bg-white container p-10 rounded-corner w-auto p-15">
                  <CircularProgress className="m-auto" />
                </div>
              </div>
            )
          }
        />
        <Route
          path="/auth"
          element={<Auth handleCredential={handleCredential} />}
        />
      </Routes>
    </Router>
  );
}
