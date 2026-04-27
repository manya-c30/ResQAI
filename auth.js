import { auth } from './firebase.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const msg = document.getElementById("msg");

// SIGN UP
window.signup = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    msg.innerText = "Please fill all fields!";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    msg.innerText = "Signup successful! You can now login.";
  } catch (error) {
    msg.innerText = error.message;
  }
};

// LOGIN
window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    msg.innerText = "Please fill all fields!";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "home.html";
  } catch (error) {
    msg.innerText = error.message;
  }
};

// RESET PASSWORD
window.resetPassword = async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    msg.innerText = "Enter your email first!";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    msg.innerText = "Password reset email sent! Check inbox.";
  } catch (error) {
    msg.innerText = error.message;
  }
};