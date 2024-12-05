const router = require("express").Router();
const Imap = require("node-imap");

// Escape html characters
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

router.post("/", async (req, res) => {
  // Get the email address, password, and host from the body
  const { email, password, host } = req.body;

  // Check if the email, password, and host are provided
  if (!email || !password || !host) {
    return res.status(400).send(
      JSON.stringify(
        {
          code: 403,
          error: "Email, password, and host are required",
        },
        null,
        2
      )
    );
  }

  const imap = new Imap({
    user: email,
    password: password,
    host: host,
    port: 993,
    tls: true,
  });

  function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
  }

  imap.once("ready", function () {
    openInbox(function (err, box) {
      if (err) {
        console.log("Failed to open inbox: " + err);
        return res.status(500).json({
          code: 500,
          error: "Failed to open inbox",
        });
      }

      const messages = [];
      const f = imap.seq.fetch("1:*", {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        struct: true,
      });

      f.on("message", function (msg, seqno) {
        const message = { seqno, headers: "", body: "", attributes: null };
        msg.on("body", function (stream, info) {
          let buffer = "";
          stream.on("data", function (chunk) {
            buffer += chunk.toString("utf8");
          });
          stream.once("end", function () {
            if (info.which === "TEXT") {
              message.body = escapeHtml(buffer);
            } else {
              message.headers = Imap.parseHeader(buffer);
            }
          });
        });
        msg.once("attributes", function (attrs) {
          message.attributes = attrs;
        });
        msg.once("end", function () {
          messages.push(message);
        });
      });

      f.once("error", function (err) {
        console.log("Fetch error: " + err);
        return res.status(500).json({
          code: 500,
          error: "Failed to fetch messages",
        });
      });

      f.once("end", function () {
        console.log("Done fetching all messages!");
        imap.end();

        // Beautify the messages
        const beautifiedMessages = messages.map((message) => {
          return {
            seqno: message.seqno,
            from: message.headers.from,
            to: message.headers.to,
            subject: message.headers.subject,
            date: message.headers.date,
            body: message.body,
          };
        });

        // Pretty print the JSON response
        const prettyPrintedMessages = JSON.stringify(
          beautifiedMessages,
          null,
          2
        );

        console.log(prettyPrintedMessages);
        res.send(prettyPrintedMessages);
      });
    });
  });

  imap.once("error", function (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      error: "Failed to connect to IMAP server",
    });
  });

  imap.connect();
});

module.exports = router;
