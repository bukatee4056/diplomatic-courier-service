import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwjcKxnViESMXyCzhML2sZPbA_HBzytMg",
  authDomain: "diplomatic-courier-service.firebaseapp.com",
  projectId: "diplomatic-courier-service",
  storageBucket: "diplomatic-courier-service.firebasestorage.app",
  messagingSenderId: "601909831194",
  appId: "1:601909831194:web:d1d2edf11f4aa5871f53a3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//
// 🔐 PROTECT ADMIN PAGE
//
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

//
// 📦 ADMIN FORM ELEMENTS
//
const tracking = document.getElementById("tracking");
const status = document.getElementById("status");
const location = document.getElementById("location");
const destination = document.getElementById("destination");
const eta = document.getElementById("eta");
const msg = document.getElementById("msg");

//
// 💾 SAVE SHIPMENT
//
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();

  if (!id) {
    msg.innerText = "❌ Enter tracking number";
    return;
  }

  try {
    await setDoc(doc(db, "shipments", id), {
      Status: status.value,
      Location: location.value,
      Destination: destination.value,
      ETA: eta.value
    });

    msg.innerText = "✅ Shipment saved successfully!";
  } catch (error) {
    console.error(error);
    msg.innerText = "❌ Error saving shipment";
  }

});
