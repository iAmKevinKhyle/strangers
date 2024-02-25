const api = "http://localhost:5000/api/user/delete/";
let time_delete;
let count = 10;
let cancel;

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    const data = {
      id: sessionStorage.getItem("_id"),
      bool: false,
    };

    // send beacon req
    navigator.sendBeacon(api + data.id + "/" + data.bool);

    // countdown to ten
    time_delete = setInterval(() => {
      console.log(count);
      count--;

      if (count === 0) {
        sessionStorage.removeItem("_id");
        sessionStorage.removeItem("_name");
        sessionStorage.removeItem("_age");
        sessionStorage.removeItem("chat_id");
        sessionStorage.removeItem("reload");

        // clear after 10 sec
        clearInterval(time_delete);

        // locatio reload
        location.reload();
      }
    }, 1000);
  }
  if (document.visibilityState === "visible") {
    const data = {
      id: sessionStorage.getItem("_id"),
      bool: true,
    };

    // send beacon req
    navigator.sendBeacon(api + data.id + "/" + data.bool);

    if (time_delete) {
      clearInterval(time_delete);
    }
    count = 10;
    console.log("cancelled");
  }
});
