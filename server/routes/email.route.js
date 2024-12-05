const router = require("express").Router();
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");

router.post("/", async (req, res) => {
  // Get the email address, password, and host from the body
  const { email, password, host } = req.body;

  // Check if the email, password, and host are provided
  if (!email || !password || !host) {
    return res.status(400).send(
      JSON.stringify({
        code: 403,
        error: "Email, password, and host are required",
      })
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
        bodies: "",
        struct: true,
      });

      f.on("message", function (msg, seqno) {
        const message = { seqno, headers: {}, body: "", attributes: null };
        msg.on("body", function (stream, info) {
          let buffer = "";
          stream.on("data", function (chunk) {
            buffer += chunk.toString("utf8");
          });
          stream.once("end", async function () {
            try {
              const parsed = await simpleParser(buffer);

              message.body = parsed.html || parsed.text;
              message.from = parsed.headers
                .get("from")
                .value.map((v) => v.address)
                .join(", ");
              message.to = parsed.headers
                .get("to")
                .value.map((v) => v.address)
                .join(", ");
              message.subject = parsed.headers.get("subject").value;
              message.date = parsed.headers.get("date").value;
            } catch (err) {
              console.log("Error parsing email: " + err);
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

        console.log(messages.headers);

        // Beautify the messages
        const beautifiedMessages = messages.map((message) => {
          return {
            seqno: message.seqno,
            from: message.from,
            to: message.to,
            subject: message.subject,
            date: message.date,
            body: message.body,
          };
        });

        res.send(JSON.stringify(beautifiedMessages, null, 2));
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
