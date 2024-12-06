import React, { useState } from "react";
import {
  Alert,
  Slide,
  Snackbar,
  SlideProps,
  TextField,
  Grid2,
  Button,
} from "@mui/material";
import { AuthInterface } from "../lib/interfaces.lib";
import { LoadingButton } from "@mui/lab";
import axios from "axios";

type TransitionProps = Omit<SlideProps, "direction">;

const Auth = ({ handleCredential }: AuthInterface) => {
  const [status, setStatus] = useState<{
    isError: boolean;
    message: string | null;
  }>({
    isError: false,
    message: "Invalid credentials",
  });

  const [data, setData] = useState<{
    email: string;
    password: string;
    incomingMailServer: string;
    outgoingMailServer: string;
  }>({
    email: "",
    password: "",
    incomingMailServer: "",
    outgoingMailServer: "",
  });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  const handleData = (key: string, value: string | number) => {
    setData({ ...data, [key]: value });
  };

  const handleLogin = () => {
    setLoading(true);

    // Check if the required fields are filled
    if (
      data.email === "" ||
      data.password === "" ||
      data.incomingMailServer === "" ||
      data.outgoingMailServer === ""
    ) {
      parseError("Make sure to fill all the required fields");
      return;
    }

    // Check if the email is valid
    else if (!data.email.includes("@") || !data.email.includes(".")) {
      parseError("Invalid email address");
      return;
    }

    // Submit the data
    else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/mail/`, data)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          // parseError(err.message);
          parseError(err.response.data.error);
        });
    }

    setLoading(false);
  };

  function parseError(errorMessage: string) {
    setLoading(false);

    setStatus({
      isError: true,
      message: errorMessage,
    });

    // setTimeout(
    //   () =>
    //     setStatus({
    //       isError: false,
    //       message: null,
    //     }),
    //   5000
    // );
  }

  return (
    <div>
      <div className="backdrop-overlay"></div>
      <div className="backdrop">
        <div className="acrylic-material"></div>
        <div className="backdrop-image" id="backdrop-image"></div>
      </div>

      <div
        className="bg-white container rounded-corner"
        style={{ padding: "40px" }}
      >
        <h1 className="center-align" style={{ marginBottom: "40px" }}>
          Welcome to
          <br />
          Email Service Portal
        </h1>
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <TextField
              label="Email Address"
              variant="outlined"
              className="w-100"
              value={data.email}
              required
              disabled={isLoading}
              onChange={(e) => handleData("email", e.target.value)}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              label="Password"
              variant="outlined"
              className="w-100"
              value={data.password}
              required
              disabled={isLoading}
              onChange={(e) => handleData("password", e.target.value)}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              label="Incoming Mail Server"
              variant="outlined"
              className="w-100"
              value={data.incomingMailServer}
              required
              disabled={isLoading}
              onChange={(e) => handleData("incomingMailServer", e.target.value)}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              label="Outgoing Mail Server"
              variant="outlined"
              className="w-100"
              value={data.outgoingMailServer}
              required
              disabled={isLoading}
              onChange={(e) => handleData("outgoingMailServer", e.target.value)}
            />
          </Grid2>

          <Grid2 size={12}>
            <LoadingButton
              variant="outlined"
              loading={isLoading}
              onClick={() => handleLogin()}
            >
              Login
            </LoadingButton>
          </Grid2>
        </Grid2>
      </div>

      <Snackbar
        open={status.isError}
        TransitionComponent={transition}
        style={{
          right: "24px",
        }}
      >
        <Alert severity="error">{status.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;
