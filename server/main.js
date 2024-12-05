const cors = require("cors");
const helmet = require("helmet");
const express = require("express");

// Load the environment variables if the app is not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Set headers to return JSON response
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Load the cors and helmet middleware
app.use(
  cors({
    origin: (origin, cb) => {
      // Check if the origin is in the list of CORS_ORIGIN
      if (process.env.CORS_ORIGIN.split(",").includes(origin) || !origin) {
        cb(null, true);
      } else {
        // Return an error if the origin is not allowed
        cb(
          JSON.stringify(
            {
              code: 403,
              error: "The origin is not allowed",
            },
            null,
            2
          )
        );
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

const emailRouter = require("./routes/email.route");
app.use("/mail", emailRouter);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
