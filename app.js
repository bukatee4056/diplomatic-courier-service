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

  const button = document.getElementById("trackBtn");
  const input = document.getElementById("trackingInput");
  const result = document.getElementById("result");

  button.addEventListener("click", async () => {

    const trackingNumber = input.value.trim();

    if (!trackingNumber) {
      result.innerHTML = "Please enter a tracking number";
      return;
    }

    try {

      const docRef = doc(db, "shipments", trackingNumber);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        result.innerHTML = "❌ Tracking number not found";
        return;
      }

      const data = docSnap.data();

      result.innerHTML = `
        <div style="padding:15px;border:1px solid #ddd;border-radius:10px;background:#fff;">
          <h3>📦 Status: ${data.status || "N/A"}</h3>

          <p>
            📍 <b>Location:</b>
            ${data.location || "N/A"}
          </p>

          <p>
            🎯 <b>Destination:</b>
            ${data.destination || "N/A"}
          </p>

          <p>
            ⏰ <b>ETA:</b>
            ${data.eta || "N/A"}
          </p>
        </div>
      `;

    } catch (error) {

      console.error("Firebase Error:", error);

      result.innerHTML = `
        ❌ Error loading shipment information
      `;
    }

  });

});
