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
      result.innerHTML = "❌ Enter tracking number";
      return;
    }

    const snap = await getDoc(doc(db, "shipments", id));

    if (!snap.exists()) {
      result.innerHTML = "❌ Shipment not found";
      return;
    }

    const data = snap.data();

    result.innerHTML = `
      <div style="padding:15px;background:#111a2e;color:white;border-radius:10px;text-align:left;max-width:500px;margin:auto;">

        <h2>📦 Tracking: ${id}</h2>

        <p>📍 Location: ${data.location}</p>
        <p>🎯 Destination: ${data.destination}</p>
        <p>⏰ ETA: ${data.eta}</p>
        <p>📦 Status: ${data.status}</p>

        <hr>

        <h4>🚚 Route Timeline</h4>

        <ul>
          ${(data.route || []).map(r => `<li>📍 ${r}</li>`).join("")}
        </ul>

      </div>
    `;
  });

});
