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
const status = document.getElementById("status");
const location = document.getElementById("location");
const destination = document.getElementById("destination");
const eta = document.getElementById("eta");
const shippedDate = document.getElementById("shippedDate");

const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

const msg = document.getElementById("msg");
const list = document.getElementById("list");

// SAVE / UPDATE
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();

  if (!id) return (msg.innerText = "❌ Enter tracking number");

  await setDoc(doc(db, "shipments", id), {
    status: status.value,
    location: location.value,
    destination: destination.value,
    eta: eta.value,
    shippedDate: shippedDate.value || "",

    customerName: customerName.value || "",
    phone: phone.value || "",
    address: address.value || "",

    updatedAt: Date.now()
  });

  msg.innerText = "✅ Saved successfully!";
  loadShipments();
});

// LOAD ALL
async function loadShipments() {

  const snap = await getDocs(collection(db, "shipments"));

  let html = "";

  snap.forEach(d => {

    const data = d.data();

    html += `
      <div class="card">

        <b>📦 ${d.id}</b><br><br>

        👤 ${data.customerName || "N/A"}<br>
        📞 ${data.phone || "N/A"}<br>
        🏠 ${data.address || "N/A"}<br><br>

        📍 ${data.location} → ${data.destination}<br>
        📦 ${data.status}<br>
        📅 ${data.shippedDate || "N/A"}<br>
        ⏰ ${data.eta}<br><br>

        <button onclick="editShipment('${d.id}')">Edit</button>
        <button onclick="deleteShipment('${d.id}')">Delete</button>

      </div>
    `;
  });

  list.innerHTML = html || "No shipments found";
}

// DELETE
window.deleteShipment = async (id) => {
  await deleteDoc(doc(db, "shipments", id));
  loadShipments();
};

// EDIT
window.editShipment = async (id) => {

  const snap = await getDoc(doc(db, "shipments", id));
  if (!snap.exists()) return;

  const d = snap.data();

  tracking.value = id;
  status.value = d.status;
  location.value = d.location;
  destination.value = d.destination;
  eta.value = d.eta;
  shippedDate.value = d.shippedDate || "";

  customerName.value = d.customerName || "";
  phone.value = d.phone || "";
  address.value = d.address || "";
};

// INIT
loadShipments();
