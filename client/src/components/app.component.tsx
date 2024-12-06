import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Slide,
  Snackbar,
  LinearProgress,
  SlideProps,
} from "@mui/material";

import Navbar from "./navbar.component";
import BaseLayout from "./base.component";

type TransitionProps = Omit<SlideProps, "direction">;

// eslint-disable-next-line
const App = ({ auth, properties, handleChange, handleCredential }: any) => {
  const HOST_DOMAIN: string =
    process.env.REACT_APP_HOST_DOMAIN ?? window.location.origin;
  const [isOffline, setConnectionState] = useState<boolean>(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  useEffect(() => {
    const themeURL = JSON.parse(
      localStorage.getItem("theme-session") || `{}`
    ).url;

    const backgroundElement = document.getElementById("backdrop-image");

    if (backgroundElement && themeURL)
      backgroundElement.style.background = `url(${themeURL})`;
  }, []); // eslint-disable-line

  return (
    <div>
      {auth.isLoading ? <LinearProgress /> : null}
      <div className="app" style={auth.isLoading ? { height: "99.3vh" } : {}}>
        <Navbar properties={properties} handleChange={handleChange} />

        <BaseLayout
          auth={auth}
          properties={properties}
          HOST_DOMAIN={HOST_DOMAIN}
          handleChange={handleChange}
          handleCredential={handleCredential}
        />

        <Snackbar open={isOffline} TransitionComponent={transition}>
          <Alert severity="error">
            You are offline. Some functionality may be unavailable.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default App;
