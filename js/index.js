const api = "http://localhost:5000/api/user";
const form = document.querySelector("form");

if (sessionStorage.getItem("_id") !== null) {
  location.href = "page/message.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  fetch(api + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      sessionStorage.setItem("_id", data.user._id);
      sessionStorage.setItem("_name", data.user.name);
      sessionStorage.setItem("_age", data.user.age);

      location.href = "page/message.html";
    })
    .catch((error) => {
      console.log(error);
    });
});
