// fetch the initial list of dreams
fetch(window.location.pathname, { method: "POST" })
  .then(response => response.json()) // parse the JSON from the server
  .then(response => {
    let start = document.getElementById("start");
    start.addEventListener("click", () => {
      var session = OT.initSession(response.key, response.sessionId);
      let name = window.location.pathname.split("/").pop();

      session.on("streamCreated", function(event) {
        session.subscribe(
          event.stream,
          "publisher",
          {
            insertMode: "append",
            width: "400px"
          },
          console.log
        );
      });

      // Create a publisher

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
          session.publish(camPublisher, console.log);
        }
      });
    });
  });
