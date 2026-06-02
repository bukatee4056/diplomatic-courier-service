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
      result.innerHTML = "<p>❌ Enter tracking number</p>";
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

        <div class="title">📦 Tracking ID: ${id}</div>

        <div class="grid">
          <div><b>👤 Customer</b><br>${data.customerName || "N/A"}</div>
          <div><b>📞 Phone</b><br>${data.phone || "N/A"}</div>
        </div>

        <br>

        <div><b>🏠 Address:</b> ${data.address || "N/A"}</div>
        <div><b>📍 Route:</b> ${data.location} → ${data.destination}</div>

        <div class="status">
          <b>📦 Status:</b> ${data.status}
        </div>

        <div class="status">
          <b>📅 Shipped Date:</b> ${data.shippedDate || "N/A"}<br>
          <b>⏰ ETA:</b> ${data.eta || "N/A"}
        </div>

        <h3>🚚 Tracking Progress</h3>

        <div class="step">✔ Order Confirmed</div>
        <div class="step">✔ Package Picked Up</div>
        <div class="step">🚚 In Transit</div>
        <div class="step">📍 Out for Delivery</div>
        <div class="step">🏁 Delivered</div>

      </div>
    `;
  });

});
