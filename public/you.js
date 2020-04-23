// fetch the initial list of dreams
fetch(window.location.pathname, { method: "POST" })
  .then(response => response.json()) // parse the JSON from the server
  .then(response => {
    var session = OT.initSession(response.key, response.sessionId);
    let name = window.location.pathname.split("/").pop();

    session.on("streamCreated", function(event) {
      if (event.stream.videoType == "screen") {
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
      } else {
        session.subscribe(
          event.stream,
          "publisher",
          {
            insertMode: "append",
            width: "400px"
          },
          console.log
        );
      }
    });

    // Create a publisher
    var screenPublisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "400px",
        videoSource: "screen",
        name: `${name} - <a href="${window.location.pathname}/screen" target="_blank">${window.location.pathname}/screen</a>`
      },
      console.log
    );

    var camPublisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "400px",
        name: `${name} - <a href="${window.location.pathname}/cam" target="_blank">${window.location.pathname}/cam</a>`
      },
      console.log
    );

    // Connect to the session
    session.connect(response.token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        console.log(error);
      } else {
        session.publish(screenPublisher, console.log);
        session.publish(camPublisher, console.log);
      }
    });
  });
