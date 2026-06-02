import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

// 🔐 protect admin
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

const tracking = document.getElementById("tracking");
const status = document.getElementById("status");
const location = document.getElementById("location");
const destination = document.getElementById("destination");
const eta = document.getElementById("eta");
const msg = document.getElementById("msg");

const tableBody = document.getElementById("tableBody");

// 💾 CREATE / UPDATE SHIPMENT
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();

  if (!id) {
    msg.innerText = "Enter tracking number";
    return;
  }

  await setDoc(doc(db, "shipments", id), {
    Status: status.value,
    Location: location.value,
    Destination: destination.value,
    ETA: eta.value
  });

  msg.innerText = "Saved successfully ✔️";
  loadShipments();
});

// 📡 LOAD ALL SHIPMENTS
async function loadShipments() {

  tableBody.innerHTML = "";

  const snap = await getDocs(collection(db, "shipments"));

  snap.forEach(docSnap => {
    const data = docSnap.data();

    tableBody.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${data.Status}</td>
        <td>${data.Location}</td>
        <td>${data.Destination}</td>
        <td>${data.ETA}</td>
        <td>
          <button onclick="editShipment('${docSnap.id}', '${data.Status}', '${data.Location}', '${data.Destination}', '${data.ETA}')">Edit</button>
          <button onclick="deleteShipment('${docSnap.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// 🗑 DELETE
window.deleteShipment = async (id) => {
  await deleteDoc(doc(db, "shipments", id));
  loadShipments();
};

// ✏️ EDIT
window.editShipment = (id, s, l, d, e) => {
  tracking.value = id;
  status.value = s;
  location.value = l;
  destination.value = d;
  eta.value = e;
};

// initial load
loadShipments();
