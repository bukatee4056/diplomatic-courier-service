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
      <div style="text-align:left;border:1px solid #ddd;padding:10px;border-radius:8px">

        <h3>📦 ${id}</h3>

        👤 Customer: ${data.customerName || "N/A"}<br>
        📞 Phone: ${data.phone || "N/A"}<br>
        🏠 Address: ${data.address || "N/A"}<br><br>

        📍 ${data.location}<br>
        🎯 ${data.destination}<br>
        📦 ${data.status}<br>
        📅 Shipped: ${data.shippedDate || "N/A"}<br>
        ⏰ ETA: ${data.eta}

      </div>
    `;
  });

});
