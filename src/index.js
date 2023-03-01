import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyALQYwKQnPvVrAivg4x5zK1sagfKxWT-UA",
  authDomain: "notsapp-2444f.firebaseapp.com",
  databaseURL: "https://notsapp-2444f-default-rtdb.firebaseio.com",
  projectId: "notsapp-2444f",
  storageBucket: "notsapp-2444f.appspot.com",
  messagingSenderId: "929735103292",
  appId: "1:929735103292:web:289fdd71c68f99aed2c439",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const messages = document.getElementsByClassName("main")[0];

const sendBtn = document.getElementsByTagName("button")[0];
const msgField = document.getElementsByTagName("input")[0];
const user = prompt("INSIRA SEU NOME");

const path = ref(database, "messages");

let numMessages;
let msgCont;
let lastAuthor = "";

get(path).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    const keys = Object.keys(data);
    numMessages = keys.length;

    msgCont = keys.pop();
    msgCont = msgCont.slice(3, msgCont.length);

    for (const [key, value] of Object.entries(data)) {
      AppendMessage(value.author, value.content);
      messages.scrollTop = messages.scrollHeight;
      lastAuthor = value.author;
    }
  }
});

onValue(path, (snapshot) => {
  const data = snapshot.val();
  const keys = Object.keys(data);
  const values = Object.values(data).pop();

  if (keys.length > numMessages) {
    msgCont = keys.pop();
    msgCont = msgCont.slice(3, msgCont.length);
    AppendMessage(values.author, values.content);
    messages.scrollTop = messages.scrollHeight;
    lastAuthor = values.author;
  }
});

sendBtn.addEventListener("click", SendMessage);
msgField.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    SendMessage();
  }
});

function AppendMessage(name, text) {
  if (name == lastAuthor) {
    if (name == user) {
      messages.innerHTML += `
        <div class="message" style="align-items: flex-end">
            <p 
                class="content" 
                style="border-radius: 1rem 0 1rem 1rem;
                background: #d9d9d9"
            >
                ${text}
            </p>
        </div>
        `;
    } else {
      messages.innerHTML += `
        <div class="message">
            <p class="content">${text}</p>
        </div>
        `;
    }
  } else {
    if (name == user) {
      messages.innerHTML += `
          <div class="message" style="align-items: flex-end">
              <span class="author">${name}</span>
              <p 
                  class="content" 
                  style="border-radius: 1rem 0 1rem 1rem;
                  background: #d9d9d9"
              >
                  ${text}
              </p>
          </div>
          `;
    } else {
      messages.innerHTML += `
          <div class="message">
              <span class="author">${name}</span>
              <p class="content">${text}</p>
          </div>
          `;
    }
  }
}

function SendMessage() {
  const message = document.getElementsByTagName("input")[0].value;
  if (message != "") {
    set(ref(database, `messages/msg${msgCont + 1}`), {
      author: user,
      content: message,
    });
    document.getElementsByTagName("input")[0].value = "";
  }
}
