// fetch the initial list of dreams
fetch(window.location.pathname, { method: "POST" })
  .then(response => response.json()) // parse the JSON from the server
  .then(response => {
    let start = document.getElementById("start");
    start.addEventListener("click", () => {
      document.getElementById("publisher").innerHTML = "";
      var session = OT.initSession(response.key, response.sessionId);
      let name = window.location.pathname.split("/").pop();

      session.on("streamCreated", function(event) {
        session.subscribe(
          event.stream,
          "publisher",
          {
            insertMode: "append",
            width: "100%"
          },
          console.log
        );
      });

      // Create a publisher

      var camPublisher = OT.initPublisher(
        "publisher",
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
          name: ""
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
