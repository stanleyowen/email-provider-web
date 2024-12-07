import React, { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Logout } from "../lib/icons.component";

// eslint-disable-next-line
const Navbar = ({ auth, properties, handleChange, handleCredential }: any) => {
  const [property, setProperty] = useState({
    disablePrevious: true,
    disableForward: true,
  });

  useEffect(() => {
    setProperty({
      disablePrevious:
        properties.history?.length > 1 && properties.action > 0 ? false : true,
      disableForward:
        properties.action + 1 < properties.history?.length ? false : true,
    });
  }, [properties]);

  const triggerAction = (type: "next" | "previous") => {
    if (type === "previous")
      handleChange({
        id: "activeTab",
        value: properties.history[properties.action - 1],
        goBackward: true,
      });
    else
      handleChange({
        id: "activeTab",
        value: properties.history[properties.action + 1],
        goForward: true,
      });
  };

  const logout = () => {
    // Remove the local storage session
    localStorage.removeItem("credentials");

    // Remove the user from the session
    handleCredential({
      isLoading: false,
      loggedIn: false,
      emails: [],
    });
  };

  return (
    <div className="navbar">
      <div className="m-10-auto">
        <Tooltip title="Go Back" enterDelay={500} enterNextDelay={500}>
          <div>
            <IconButton
              onClick={() => triggerAction("previous")}
              disabled={property.disablePrevious}
            >
              <ChevronLeft />
            </IconButton>
          </div>
        </Tooltip>
      </div>
      <div className="m-10-auto">
        <Tooltip title="Go Forward" enterDelay={500} enterNextDelay={500}>
          <div>
            <IconButton
              onClick={() => triggerAction("next")}
              disabled={property.disableForward}
            >
              <ChevronRight />
            </IconButton>
          </div>
        </Tooltip>
      </div>
      <div className="mrl-10">
        <Tooltip title="Logout" enterDelay={500} enterNextDelay={500}>
          <IconButton onClick={() => logout()} className="p-10">
            <Logout />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;
