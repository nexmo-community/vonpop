// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
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

app.get("/room/:room", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.sendFile(__dirname + "/views/room.html");
});

app.post("/room/:room", (request, response) => {
  if (sessions[request.params.room]) {
    response.json({ sessionId: sessions[request.params.room] });
  } else {
    opentok.createSession(
      { mediaMode: "routed", archiveMode: "always" },
      (err, session) => {
        if (err) return console.log(err);

        // save the sessionId
        sessions[request.params.room] = session.sessionId;
        response.json({ sessionId: sessions[request.params.room] });
      }
    );
  }
});

app.get("/room/:room/:name", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.sendFile(__dirname + "/views/you.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
