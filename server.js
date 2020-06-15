const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const OpenTok = require("opentok");
const opentok = new OpenTok(process.env.TOKBOX_KEY, process.env.TOKBOX_SECRET);

let sessions = {};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/record/:id", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.sendFile(__dirname + "/views/record.html");
});

app.post("/record/:id", (request, response) => {
  if (sessions[request.params.id]) {
    response.json({
      key: process.env.TOKBOX_KEY,
      sessionId: sessions[request.params.id],
      token: opentok.generateToken(sessions[request.params.id], {
        role: "publisher",
        expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60 // in one week
      })
    });
  } else {
    opentok.createSession({ mediaMode: "routed" }, (err, session) => {
      if (err) return console.log(err);

      // save the sessionId
      sessions[request.params.id] = session.sessionId;
      response.json({
        key: process.env.TOKBOX_KEY,
        sessionId: sessions[request.params.id],
        token: session.generateToken({
          role: "publisher",
          expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60 // in one week
        })
      });
    });
  }
});

app.post("/record/:id/start", (request, response) => {
  if (sessions[request.params.id]) {
    opentok.startArchive(
      sessions[request.params.id],
      {
        name: request.params.id
      },
      (err, archive) => {
        if (err)
          return response.send(
            500,
            "Could not start archive for session " +
              request.params.id +
              ". error=" +
              err.message
          );
        response.json(archive);
      }
    );
  }
});

app.post("/record/:id/stop", (request, response) => {
  if (sessions[request.params.id]) {
    opentok.startArchive(
      sessions[request.params.id],
      {
        name: request.params.id
      },
      (err, archive) => {
        if (err)
          return response.send(
            500,
            "Could not start archive for session " +
              request.params.id +
              ". error=" +
              err.message
          );
        response.json(archive);
      }
    );
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
