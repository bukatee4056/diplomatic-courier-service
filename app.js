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

function getStep(status){
  const map = {
    "Order Confirmed": 1,
    "Package Picked Up": 2,
    "In Transit": 3,
    "Out for Delivery": 4,
    "Delivered": 5
  };
  return map[status] || 0;
}

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("trackBtn");
  const input = document.getElementById("trackingInput");
  const result = document.getElementById("result");

  btn.addEventListener("click", async () => {

    const id = input.value.trim();

    if(!id){
      result.innerHTML = "<p>Enter tracking number</p>";
      return;
    }

    const snap = await getDoc(doc(db,"shipments",id));

    if(!snap.exists()){
      result.innerHTML = "<p>Shipment not found</p>";
      return;
    }

    const d = snap.data();
    const step = getStep(d.status);

    result.innerHTML = `
      <div class="card">

        <h2>📦 ${id}</h2>

        <div class="grid">

          <div class="box">
            <div class="label">Customer</div>
            <div class="value">${d.customerName || "N/A"}</div>
          </div>

          <div class="box">
            <div class="label">Phone</div>
            <div class="value">${d.phone || "N/A"}</div>
          </div>

          <div class="box">
            <div class="label">Route</div>
            <div class="value">${d.location} → ${d.destination}</div>
          </div>

          <div class="box">
            <div class="label">Status</div>
            <div class="value">${d.status}</div>
          </div>

          <div class="box">
            <div class="label">Shipped Date</div>
            <div class="value">${d.shippedDate || "N/A"}</div>
          </div>

          <div class="box">
            <div class="label">ETA</div>
            <div class="value">${d.eta || "N/A"}</div>
          </div>

        </div>

        <h3>🚚 Tracking Progress</h3>

        <div class="timeline">
          <div class="step ${step>=1?'active':''}">✔ Order Confirmed</div>
          <div class="step ${step>=2?'active':''}">📦 Package Picked Up</div>
          <div class="step ${step>=3?'active':''}">🚚 In Transit</div>
          <div class="step ${step>=4?'active':''}">📍 Out for Delivery</div>
          <div class="step ${step>=5?'active':''}">🏁 Delivered</div>
        </div>

        <button class="btn">⬇ Download Receipt</button>

      </div>
    `;
  });

});
