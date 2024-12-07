import React from "react";

import Search from "./search.component";
import Home from "./home.component";
import Settings from "./settings.component";
import ComposeEmail from "./compose.component";

// eslint-disable-next-line
const BaseLayout = ({
  auth,
  properties,
  handleChange,
  handleCredential,
}: any) => {
  return (
    <div className="base">
      {properties.activeTab === "home" ? (
        <Home auth={auth} />
      ) : properties.activeTab === "compose" ? (
        <ComposeEmail auth={auth} handleCredential={handleCredential} />
      ) : properties.activeTab === "search" ? (
        <Search auth={auth} />
      ) : (
        <Settings />
      )}
    </div>
  );
};

export default BaseLayout;
