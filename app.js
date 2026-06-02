import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

window.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded");

  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  if (!button || !input || !result) {
    console.log("Missing elements");
    return;
  }

  button.addEventListener("click", async () => {
    console.log("Clicked");

    const trackingNumber = input.value.trim();

    if (!trackingNumber) {
      result.innerHTML = "Enter tracking number";
      return;
    }

    try {
      const docRef = doc(db, "shipments", trackingNumber);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        result.innerHTML = "Tracking number not found";
        return;
      }

const data = docSnap.data();

function getField(obj, key) {
  return obj[key] || obj[key.toLowerCase()] || obj[key.toUpperCase()] || "N/A";
}

result.innerHTML = `
  <h3>Status: ${getField(data, "Status")}</h3>
  <p><b>Location:</b> ${getField(data, "Location")}</p>
  <p><b>Destination:</b> ${getField(data, "Destination")}</p>
  <p><b>ETA:</b> ${getField(data, "ETA")}</p>
`;

    } catch (err) {
      console.log("ERROR:", err);
      result.innerHTML = "Something went wrong. Check console.";
    }
  });
});