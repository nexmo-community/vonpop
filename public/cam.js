// fetch the initial list of dreams
fetch(window.location.pathname, { method: "POST" })
  .then(response => response.json()) // parse the JSON from the server
  .then(response => {
    var session = OT.initSession(response.key, response.sessionId);

    session.on("streamCreated", (event) => {
      if (event.stream.name == window.location.pathname.split("/")[3] && event.stream.videoType != "screen") {
        session.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "auto",
            height: "100%"
          },
          console.log
        );
      }
    });

    // Connect to the session
    session.connect(response.token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        console.log(error);
      } else {
      }
    });
  });
