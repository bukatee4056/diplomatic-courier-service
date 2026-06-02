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
      result.innerHTML = "Please enter tracking number";
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

      // 🔥 SMART AUTO DETECTION (NO MORE FIELD PROBLEMS EVER)
      const status =
        data.Status ||
        data.status ||
        data["Status "] ||
        data["status "] ||
        "N/A";

      const location =
        data.Location ||
        data.location ||
        data["Location "] ||
        data["location "] ||
        "N/A";

      const destination =
        data.Destination ||
        data.destination ||
        data["Destination "] ||
        data["destination "] ||
        "N/A";

      const eta =
        data.ETA ||
        data.eta ||
        data["ETA "] ||
        data["eta "] ||
        "N/A";

      result.innerHTML = `
        <h3>Status: ${status}</h3>
        <p><b>Location:</b> ${location}</p>
        <p><b>Destination:</b> ${destination}</p>
        <p><b>ETA:</b> ${eta}</p>
      `;

    } catch (error) {
      console.error(error);
      result.innerHTML = "Error loading shipment data";
    }

  });

});