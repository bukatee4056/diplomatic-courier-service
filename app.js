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

  let currentData = null;
  let currentId = null;

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

    currentData = data;
    currentId = id;

    result.innerHTML = `
      <div class="card">

        <h3>📦 Tracking: ${id}</h3>

        <p>📍 Location: ${data.location}</p>
        <p>🎯 Destination: ${data.destination}</p>
        <p>⏰ ETA: ${data.eta}</p>
        <p class="status">📦 Status: ${data.status}</p>

        <hr>

        <h4>🚚 Route Timeline</h4>

        <ul>
          ${(data.route || []).map(r => `<li>📍 ${r}</li>`).join("")}
        </ul>

        <button class="receipt-btn" id="receiptBtn">
          Download Receipt
        </button>

      </div>
    `;

    document.getElementById("receiptBtn").onclick = downloadReceipt;

  });

  function downloadReceipt() {

    if (!currentData || !currentId) return;

    const content = `
===== SHIPPING RECEIPT =====

Tracking Number: ${currentId}

Status: ${currentData.status}
Location: ${currentData.location}
Destination: ${currentData.destination}
ETA: ${currentData.eta}

Route:
${(currentData.route || []).join(" → ")}

Generated: ${new Date().toLocaleString()}

===========================
`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `receipt-${currentId}.txt`;

    link.click();
  }

});
