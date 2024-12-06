export interface AuthInterface {
  handleCredential: any;
}

export interface HandleCredential {
  id: "isLoading" | "loggedIn";
  value: boolean;
}

export interface HandleCredentialAuth {
  isLoading: boolean;
  loggedIn: boolean;
}
