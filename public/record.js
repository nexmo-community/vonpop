// fetch the initial list of dreams
fetch(window.location.pathname, {method: "POST"})
  .then(response => response.json()) // parse the JSON from the server
  .then((response) => {
  console.log(response)
});
