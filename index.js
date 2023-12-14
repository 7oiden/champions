import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-36eff-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messagesInDB = ref(database, "messages");

const msgInputField = document.getElementById("input-field");
const fromInputField = document.getElementById("from-field");
const toInputField = document.getElementById("to-field");
const publishBtn = document.getElementById("publish-btn");
const msgList = document.getElementById("msg-list");

publishBtn.addEventListener("click", addMsg);

function addMsg() {
  let inputValues = {
    to: toInputField.value,
    from: fromInputField.value,
    msg: msgInputField.value,
    likes: 0,
  };

  if (inputValues) {
    push(messagesInDB, inputValues);
    clearInputFields();
  }
}

onValue(messagesInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    let reversedItemsArray = itemsArray.reverse();

    clearMsgList();
    // console.log(itemsArray);

    reversedItemsArray.forEach((msg) => {
      let currentMsg = msg;

      addMgsToList(currentMsg);
    });
  }
});

function clearInputFields() {
  msgInputField.value = "";
  fromInputField.value = "";
  toInputField.value = "";
}

function clearMsgList() {
  msgList.innerHTML = "";
}

function addMgsToList(msg) {
  console.log(msg);
  let msgId = msg[0];
  let msgValue = msg[1];

  let newEl = document.createElement("li");

  newEl.innerHTML += `
    <div class="card">
    <p class="name">From ${msgValue.from}</p>
    <p>Message: ${msgValue.msg}</p>
    <p class="name">To ${msgValue.to}</p>
    <span id="likes-${msgId}">${msgValue.likes}</span>
    </div>`;

  msgList.appendChild(newEl);

  newEl.addEventListener("click", () => {
    let msgRef = ref(database, "messages/" + msgId);

    update(msgRef, {
      likes: msgValue.likes + 1,
    });
  });
}
