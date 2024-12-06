const router = require("express").Router();
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  // Get the email address, password, and host from the body
  const { email, password, incomingMailServer: host, startId } = req.body;

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
      const f = imap.seq.fetch(startId + ":" + (startId + 50), {
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

              message.subject = parsed.headers.get("subject");
              message.date = parsed.headers.get("date");
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

router.post("/send", async (req, res) => {
  const {
    email,
    password,
    outgoingMailServer: host,
    to,
    subject,
    text,
  } = req.body;

  if (!email || !password || !host || !to || !subject || !text) {
    return res.status(400).send(
      JSON.stringify({
        code: 403,
        error: "Email, password, host, to, subject, and text are required",
      })
    );
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        code: 500,
        error: "Failed to send email",
      });
    } else {
      console.log("Email sent: " + info.response);
      res.send(JSON.stringify({ message: "Email sent" }, null, 2));
    }
  });
});

module.exports = router;
