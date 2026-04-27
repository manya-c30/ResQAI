import { auth, db } from './firebase.js';
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const contactInput = document.getElementById("contact");
const contactList = document.getElementById("contactList");

let contacts = [];
let currentUser = null;

/* ===============================
   🔐 AUTH CHECK
================================ */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  loadContacts(); // ✅ load properly
});

/* ===============================
   📥 LOAD CONTACTS
================================ */
async function loadContacts() {
  try {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      contacts = docSnap.data().contacts || [];
    } else {
      contacts = [];
    }

    displayContacts();

  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

/* ===============================
   ➕ ADD CONTACT
================================ */
window.addContact = async () => {

  const number = contactInput.value.trim();

  if (!number) {
    showMessage("⚠ Enter a phone number");
    return;
  }

  if (contacts.includes(number)) {
    showMessage("⚠ Contact already exists");
    return;
  }

  contacts.push(number);

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      { contacts: contacts },
      { merge: true }   // ✅ IMPORTANT FIX
    );

    showMessage("✅ Contact saved");

    contactInput.value = "";
    displayContacts();

  } catch (error) {
    console.error("Error saving contact:", error);
    showMessage("❌ Failed to save");
  }
};

/* ===============================
   📋 DISPLAY CONTACTS
================================ */
function displayContacts() {
  contactList.innerHTML = "";

  if (contacts.length === 0) {
    contactList.innerHTML = "<p>No contacts yet</p>";
    return;
  }

  contacts.forEach((num) => {
    const li = document.createElement("li");
    li.textContent = num;
    contactList.appendChild(li);
  });
}

/* ===============================
   💬 UI MESSAGE (BETTER THAN ALERT)
================================ */
function showMessage(text) {
  let msg = document.getElementById("msg");

  if (!msg) {
    msg = document.createElement("p");
    msg.id = "msg";
    document.querySelector(".card").appendChild(msg);
  }

  msg.innerText = text;

  setTimeout(() => {
    msg.innerText = "";
  }, 3000);
}