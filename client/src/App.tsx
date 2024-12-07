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
  const [properties, setProperties] = useState<any>({
    action: 0,
    activeTab: window.localStorage.getItem("tab-session") ?? "home",
    history: [window.localStorage.getItem("tab-session") ?? "home"],
  });

  const [auth, setAuth] = useState<{
    isLoading: boolean;
    loggedIn: boolean;
    emails: any[];
  }>({
    isLoading: true,
    loggedIn: false,
    emails: [],
  });

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

  useEffect(() => {
    console.log("App component mounted");

    const data = localStorage.getItem("credentials");
    if (data) {
      // Get the credentials from the local storage
      const parsedData = JSON.parse(data);

      // Recursive function to fetch messages
      const fetchMessages = async (startId = 0) => {
        await axios
          .post(`${process.env.REACT_APP_API_URL}/mail/`, {
            ...parsedData,
            startId,
          })
          .then((response) => {
            // Set loading to false and logged in to true immediately
            setAuth((prevAuth) => ({
              ...prevAuth,
              isLoading: false,
              loggedIn: true,
            }));

            if (response.status === 200) {
              setAuth((prevAuth) => ({
                ...prevAuth,
                emails: [...prevAuth.emails, ...response.data],
              }));
              // Fetch the next batch of messages
              fetchMessages(startId + 50);
            }
          })
          .catch((err: any) => {
            if (err.response && err.response.status === 404) {
              // Stop fetching when a 404 status code is received
              setAuth((prevAuth) => ({ ...prevAuth, isLoading: false }));
            } else {
              console.error(err);
              setAuth((prevAuth) => ({ ...prevAuth, isLoading: false }));
            }
          });
      };

      // Start fetching messages
      fetchMessages();
    } else {
      // Set the loading state to false if no credentials are found
      setAuth((prevAuth) => ({ ...prevAuth, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.loggedIn && !window.location.pathname.startsWith("/auth"))
        // eslint-disable-next-line no-restricted-globals
        location.href = "/auth";
      else if (auth.loggedIn && window.location.pathname.startsWith("/auth"))
        // eslint-disable-next-line no-restricted-globals
        location.href = "/";
    }
  }, [auth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            auth.loggedIn ? (
              <div>
                <div className="backdrop-overlay"></div>
                <div className="backdrop">
                  <div className="acrylic-material"></div>
                  <div className="backdrop-image" id="backdrop-image"></div>
                </div>
                <SideBar properties={properties} handleChange={handleChange} />
                <AppLayout
                  auth={auth}
                  properties={properties}
                  handleChange={handleChange}
                  handleCredential={handleCredential}
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
          element={<Auth auth={auth} handleCredential={handleCredential} />}
        />
      </Routes>
    </Router>
  );
}
