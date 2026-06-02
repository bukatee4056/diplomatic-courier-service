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

  const btn = document.getElementById("trackBtn");
  const input = document.getElementById("trackingInput");
  const result = document.getElementById("result");

  btn.addEventListener("click", async () => {

    const id = input.value.trim();

    if (!id) {
      result.innerHTML = "<p>❌ Please enter tracking number</p>";
      return;
    }

    const snap = await getDoc(doc(db, "shipments", id));

    if (!snap.exists()) {
      result.innerHTML = "<p>❌ Shipment not found</p>";
      return;
    }

    const data = snap.data();

    result.innerHTML = `
      <div class="card">

        <p><b>📦 Tracking:</b> ${id}</p>

        <p><b>📍 Location:</b> ${data.location}</p>

        <p><b>🎯 Destination:</b> ${data.destination}</p>

        <p><b>⏰ ETA:</b> ${data.eta}</p>

        <p class="status">📦 Status: ${data.status}</p>

        <hr>

        <p><b>🚚 Route Timeline</b></p>

        <ul>
          ${(data.route || []).map(r => `<li>${r}</li>`).join("")}
        </ul>

      </div>
    `;
  });

});
