// api
const userApi = "http://localhost:5000/api/user";
const chatApi = "http://localhost:5000/api/chat";

// message body
const message_body = document.querySelector("div.body");
const message_form = document.querySelector(".message_form");
const find_new = document.querySelector(".find-new-stranger");

// loading display
const loading = document.querySelector(".loading");
const no_message = document.querySelector(".no-message");

let time_out;
let chatArray = [];

// loading display control
function loadingControl(state = "show") {
  if (state === "none") {
    if (loading.classList.contains("block")) {
      loading.classList.remove("block");
    }
    loading.classList.add("none");
  } else {
    if (loading.classList.contains("none")) {
      loading.classList.remove("none");
    }
    loading.classList.add("block");
  }
}
function no_messageControl(state = "show") {
  if (state === "none") {
    if (no_message.classList.contains("block")) {
      no_message.classList.remove("block");
    }
    no_message.classList.add("none");
  } else {
    if (no_message.classList.contains("none")) {
      no_message.classList.remove("none");
    }
    no_message.classList.add("block");
  }
}

// find if user has found a partner
window.addEventListener("load", () => {
  if (sessionStorage.getItem("_id")) {
    has_a_partner_yet();
  } else {
    location.href = "../index.html";
  }
});

// check if user found a partner
async function has_a_partner_yet() {
  if (time_out) {
    clearTimeout(time_out);
  }
  if (sessionStorage.getItem("chat_id") !== null) {
    loadingControl("none");
  } else {
    loadingControl();
  }

  await fetch(userApi + "/found/" + sessionStorage.getItem("_id"))
    .then((res) => res.json())
    .then((data) => {
      if (data.found) {
        sessionStorage.setItem("chat_id", data.user.chat[0]);
        fetch_chat_content(data.user.chat[0]);

        if (sessionStorage.getItem("reload") !== null) {
          sessionStorage.removeItem("reload");
          location.reload();
        }

        if (chatArray.length === 0) {
          no_messageControl();
        } else {
          no_messageControl("none");
        }
      } else {
        loadingControl();
        sessionStorage.removeItem("chat_id");
        sessionStorage.setItem("reload", true);
      }
    });

  time_out = setTimeout(() => {
    has_a_partner_yet();
    // console.log("has_a_partner_yet...");
  }, 750);
}

// if there is a partner
async function fetch_chat_content(chatId) {
  await fetch(chatApi + "/new/" + chatId + "/" + chatArray.length)
    .then((res) => res.json())
    .then(async (data) => {
      const number = data.count - chatArray.length;

      if (data.new) {
        for (let i = chatArray.length; i < data.count; i++) {
          chatArray.push(i);
        }
      }

      if (number > 0) {
        let index = chatArray[chatArray.length - number];
        for (let i = 0; i < number; i++) {
          await fetch_message(index, chatId);
          index++;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// if ther is a new index fetch it
async function fetch_message(index, chatId) {
  await fetch(chatApi + "/get/" + index + "/" + chatId)
    .then((res) => res.json())
    .then((data) => {
      create_chat_element_and_append(data.message);
    })
    .catch((error) => {
      error;
    });
}

// create chat element and append it to the body
function create_chat_element_and_append(message) {
  const p = document.createElement("p");
  p.classList.add("message");
  p.setAttribute("data-chat-id", message._id);
  if (message.user_id === sessionStorage.getItem("_id")) {
    p.classList.add("me");
  }
  p.innerText = message.user_message;
  message_body.appendChild(p);
  scroll_to_height();
}

// scroll to latest message
function scroll_to_height() {
  message_body.scrollTo(0, message_body.scrollHeight);
}

// SEND MESSAGE
message_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const chat_id = sessionStorage.getItem("chat_id");
  const user_id = sessionStorage.getItem("_id");
  const user_message = message_form.querySelector('input[type="text"');

  const data = {
    chat_id,
    user_id,
    user_message: user_message.value,
  };

  fetch(chatApi + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });

  user_message.value = "";
});

// todo: FIND NEW STRANGERS
find_new.addEventListener("click", async () => {
  // reset values
  clearTimeout(time_out);
  sessionStorage.removeItem("chat_id");
  chatArray = [];
  loadingControl();

  await fetch(userApi + "/find/" + sessionStorage.getItem("_id"), {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      // start fetching
      has_a_partner_yet();
    })
    .catch((error) => {
      console.log(error);
    });
});
