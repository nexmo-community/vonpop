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
          error => {
            let names = document.querySelectorAll(".OT_name");
            names.forEach(nameElement => {
              if (nameElement.innerHTML == event.stream.name) {
                let path = window.location.href.split("/");
                path[path.length - 1] = event.stream.name;
                path.push("screen");
                nameElement.innerHTML = `${
                  event.stream.name
                } - <a href="${path.join("/")}" target="_blank">${path.join(
                  "/"
                )}</a>`;
              }
            });
          }
        );
      } else {
        session.subscribe(
          event.stream,
          "publisher",
          {
            insertMode: "append",
            width: "400px"
          },
          error => {
            let names = document.querySelectorAll(".OT_name");
            names.forEach(nameElement => {
              if (nameElement.innerHTML == event.stream.name) {
                let path = window.location.href.split("/");
                path[path.length - 1] = event.stream.name;
                path.push("cam");
                nameElement.innerHTML = `${
                  event.stream.name
                } - <a href="${path.join("/")}" target="_blank">${path.join(
                  "/"
                )}</a>`;
              }
            });
          }
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
        name: name
      },
      console.log
    );

    var camPublisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "400px",
        name: name
      },
      console.log
    );

    // Connect to the session
    session.connect(response.token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        console.log(error);
      } else {
        session.publish(screenPublisher, error => {
            let names = document.querySelectorAll(".OT_name");
            names.forEach(nameElement => {
              if (nameElement.innerHTML == screenPublisher.stream.name) {
                let path = window.location.href.split("/");
                path[path.length - 1] = screenPublisher.stream.name;
                path.push("screen");
                nameElement.innerHTML = `${
                  event.stream.name
                } - <a href="${path.join("/")}" target="_blank">${path.join(
                  "/"
                )}</a>`;
              }
            });
          });
        session.publish(camPublisher, console.log);
      }
    });
  });
