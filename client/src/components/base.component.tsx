import React from "react";

import Search from "./search.component";
import Path from "./logs-path.component";
import Home from "./home.component";
import Settings from "./settings.component";
import Environment from "./env.component";

// eslint-disable-next-line
const BaseLayout = ({
  auth,
  properties,
  HOST_DOMAIN,
  handleChange,
  handleCredential,
}: any) => {
  return (
    <div className="base">
      {properties.activeTab === "home" ? (
        <Home auth={auth} />
      ) : properties.activeTab === "search" ? (
        <Search auth={auth} properties={properties} HOST_DOMAIN={HOST_DOMAIN} />
      ) : properties.activeTab === "path" ? (
        <Path properties={properties} HOST_DOMAIN={HOST_DOMAIN} />
      ) : properties.activeTab === "environment" ? (
        <Environment properties={properties} HOST_DOMAIN={HOST_DOMAIN} />
      ) : (
        <Settings />
      )}
    </div>
  );
};

export default BaseLayout;
