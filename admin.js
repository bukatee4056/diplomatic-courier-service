import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// INPUTS
const tracking = document.getElementById("tracking");
const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const location = document.getElementById("location");
const destination = document.getElementById("destination");
const status = document.getElementById("status");
const eta = document.getElementById("eta");
const shippedDate = document.getElementById("shippedDate");

const list = document.getElementById("list");

let currentData = null;
let currentId = null;

// SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();
  if (!id) return alert("Enter tracking number");

  await setDoc(doc(db, "shipments", id), {
    customerName: customerName.value,
    phone: phone.value,
    address: address.value,
    location: location.value,
    destination: destination.value,
    status: status.value,
    eta: eta.value,
    shippedDate: shippedDate.value,
    updatedAt: Date.now()
  });

  loadShipments();
});

// LOAD
async function loadShipments() {

  const snap = await getDocs(collection(db, "shipments"));

  let html = "";

  snap.forEach(d => {

    const data = d.data();

    html += `
      <tr>
        <td>${d.id}</td>
        <td>${data.customerName || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${data.status || ""}</td>
        <td>${data.location || ""} → ${data.destination || ""}</td>

        <td>

          <button class="edit" onclick="editShipment('${d.id}')">Edit</button>

          <button class="delete" onclick="deleteShipment('${d.id}')">Delete</button>

          <button class="pdf" onclick="downloadPDF('${d.id}')">PDF</button>

        </td>
      </tr>
    `;
  });

  list.innerHTML = html;
}

// DELETE
window.deleteShipment = async (id) => {
  await deleteDoc(doc(db, "shipments", id));
  loadShipments();
};

// EDIT
window.editShipment = async (id) => {

  const snap = await getDoc(doc(db, "shipments", id));
  const d = snap.data();

  tracking.value = id;
  customerName.value = d.customerName;
  phone.value = d.phone;
  address.value = d.address;
  location.value = d.location;
  destination.value = d.destination;
  status.value = d.status;
  eta.value = d.eta;
  shippedDate.value = d.shippedDate;

  loadMap();
};

// PDF
window.downloadPDF = async (id) => {

  const snap = await getDoc(doc(db, "shipments", id));
  const d = snap.data();

  const { jsPDF } = window.jspdf;
  const docu = new jsPDF();

  docu.text("SHIPPING RECEIPT", 20, 20);
  docu.text(`Tracking: ${id}`, 20, 40);
  docu.text(`Customer: ${d.customerName}`, 20, 50);
  docu.text(`Phone: ${d.phone}`, 20, 60);
  docu.text(`Status: ${d.status}`, 20, 70);
  docu.text(`Route: ${d.location} → ${d.destination}`, 20, 80);
  docu.text(`ETA: ${d.eta}`, 20, 90);

  docu.save(`${id}-receipt.pdf`);
};

// MAP
function loadMap() {

  const map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const route = [
    [40.7128, -74.0060],
    [51.5074, -0.1278],
    [30.0444, 31.2357],
    [6.5244, 3.3792]
  ];

  L.polyline(route, { color: 'blue' }).addTo(map);
  L.marker(route[0]).addTo(map);
}

// INIT
loadShipments();
