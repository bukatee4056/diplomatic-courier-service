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
      result.innerHTML = `
        <div style="padding:15px;background:#ffeded;color:#c00;border-radius:10px;">
          ❌ Tracking number not found
        </div>
      `;
      return;
    }

    const data = snap.data();

    result.innerHTML = `
      <div style="max-width:500px;margin:auto;padding:20px;border-radius:12px;background:#0b1220;color:white;font-family:Arial;">

        <h2>📦 Shipment Tracking</h2>

        <div style="padding:10px;background:#111a2e;border-radius:10px;margin-top:10px;">
          <h3>📦 ${id}</h3>
          <p>📍 <b>Location:</b> ${data.location}</p>
          <p>🎯 <b>Destination:</b> ${data.destination}</p>
          <p>⏰ <b>ETA:</b> ${data.eta}</p>
        </div>

        <div style="margin-top:15px;">
          <h3>🚚 Route Timeline</h3>
          <ul style="list-style:none;padding:0;">
            ${(data.route || []).map((r, i) => `
              <li style="padding:8px;margin:5px 0;background:#111a2e;border-radius:8px;">
                ${i === (data.route?.length - 1) ? "📍 CURRENT → " : "📦 "} ${r}
              </li>
            `).join("")}
          </ul>
        </div>

        <div style="margin-top:15px;">
          <h3>📊 Status</h3>
          <div style="padding:10px;border-radius:10px;background:#1b2a4a;">
            ${data.status}
          </div>
        </div>

      </div>
    `;
  });
});
