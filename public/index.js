// client-side js, loaded by index.html
// run by the browser each time the page is loaded

let form = document.getElementById("login")
form.addEventListener("submit", (event) => {
  event.preventDefault()
  
  let room = form.elements.room.value
  let you = form.elements.you.value
  
  window.location.href = `/room/${room}/${you}`
  
})
