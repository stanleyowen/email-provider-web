import React, { useState } from "react";
import { generateToken } from "../lib/functions.component";
import { Alert, Slide, Snackbar, SlideProps } from "@mui/material";
import { AuthInterface } from "../lib/interfaces.lib";

type TransitionProps = Omit<SlideProps, "direction">;

const Auth = ({ config, handleCredential }: AuthInterface) => {
  const [status, setStatus] = useState<{
    isError: boolean;
    message:
      | null
      | "Invalid Credentials"
      | "Something Went Wrong. Please Try Again Later."
      | "No Whitelisted Emails are Found. Retrying in 10 seconds...";
  }>({
    isError: false,
    message: "Invalid Credentials",
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  async function loadUsers(callback: (users: string) => void) {}

  function parseError() {
    setLoading(false);
    setStatus({
      isError: true,
      message: "Something Went Wrong. Please Try Again Later.",
    });
    setTimeout(
      () =>
        setStatus({
          isError: false,
          message: null,
        }),
      5000
    );
  }

  return (
    <div>
      <div className="backdrop-overlay"></div>
      <div className="backdrop">
        <div className="acrylic-material"></div>
        <div className="backdrop-image" id="backdrop-image"></div>
      </div>

      <div className="bg-white container p-10 rounded-corner">
        <h3 className="center-align mb-10">Welcome Back!</h3>
      </div>

      <Snackbar open={status.isError} TransitionComponent={transition}>
        <Alert severity="error">{status.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;
