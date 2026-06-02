import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwjcKxnViESMXyCzhML2sZPbA_HBzytMg",
  authDomain: "diplomatic-courier-service.firebaseapp.com",
  projectId: "diplomatic-courier-service",
  storageBucket: "diplomatic-courier-service.firebasestorage.app",
  messagingSenderId: "601909831194",
  appId: "1:601909831194:web:d1d2edf11f4aa5871f53a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("msg");

document.getElementById("loginBtn").addEventListener("click", async () => {

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);

    msg.innerText = "Login successful ✔️";

    // go to admin dashboard
    window.location.href = "admin.html";

  } catch (error) {
    console.log(error);
    msg.innerText = "Login failed ❌";
  }

});
