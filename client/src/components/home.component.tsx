import React, { useState, useEffect } from "react";
import { License, MusicOutline, SettingsOutline } from "../lib/icons.component";

const Home = ({
  auth,
  properties,
  HOST_DOMAIN,
  handleChange,
  handleCredential,
}: any) => {
  const [greeting, setGreeting] = useState<string>();
  const [viewMode, setViewMode] = useState<string | number>("list");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting("Morning");
    else if (currentHour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");
  }, []);

  const switchMode = (target: number) => {
    console.log("Switching to", target);

    setViewMode(target);
  };

  return (
    <div className="m-10">
      {viewMode === "list" ? (
        <div>
          <h2>Good {greeting}</h2>

          <div className="emails mt-10">
            {auth.emails && auth.emails.length > 0 ? (
              auth.emails.map((email: any, index: number) => (
                <button
                  key={index}
                  className="card p-10 mb-10"
                  style={{ textAlign: "left" }}
                  onClick={() => switchMode(auth.emails[index].seqno)}
                >
                  <h3>From: {email.from}</h3>
                  <p>Subject: {email.subject}</p>
                  <p>Date: {new Date(email.date).toDateString()}</p>
                </button>
              ))
            ) : (
              <p>No emails to display</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="email p-10">
            <p>From : {auth.emails[viewMode].from}</p>
            <p>Subject : {auth.emails[viewMode].subject}</p>
            <p>Date : {new Date(auth.emails[viewMode].date).toDateString()}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: auth.emails[viewMode].body,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
