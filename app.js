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

let map;
let marker;
let currentData;
let currentId;

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

    currentData = data;
    currentId = id;

    result.innerHTML = `
      <div style="background:white;padding:15px;border-radius:10px;text-align:left">

        <h3>📦 ${id}</h3>

        <p>📍 Location: ${data.location}</p>
        <p>🎯 Destination: ${data.destination}</p>
        <p>📅 Shipped Date: ${data.shippedDate || "N/A"}</p>
        <p>⏰ ETA: ${data.eta}</p>
        <p>📦 Status: ${data.status}</p>

        <button onclick="downloadPDF()">📄 Download DHL Receipt (PDF)</button>

      </div>
    `;

    loadMap(data.route || []);

  });

});

// ---------------- MAP ----------------
function loadMap(route) {

  if (!map) {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
  }

  map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  const coords = [
    [40.7128, -74.0060],
    [51.5074, -0.1278],
    [30.0444, 31.2357],
    [6.5244, 3.3792]
  ];

  L.polyline(coords, { color: 'blue' }).addTo(map);

  marker = L.marker(coords[0]).addTo(map);

  let i = 0;

  setInterval(() => {
    if (i < coords.length) {
      marker.setLatLng(coords[i]);
      map.panTo(coords[i]);
      i++;
    }
  }, 2000);
}

// ---------------- PDF RECEIPT ----------------
window.downloadPDF = function () {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("DHL STYLE SHIPPING RECEIPT", 20, 20);

  doc.setFontSize(12);

  doc.text(`Tracking: ${currentId}`, 20, 40);
  doc.text(`Status: ${currentData.status}`, 20, 50);
  doc.text(`Location: ${currentData.location}`, 20, 60);
  doc.text(`Destination: ${currentData.destination}`, 20, 70);
  doc.text(`Shipped Date: ${currentData.shippedDate || "N/A"}`, 20, 80);
  doc.text(`ETA: ${currentData.eta}`, 20, 90);

  doc.save(`DHL-Receipt-${currentId}.pdf`);
};
