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

// LOAD TABLE
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
        <td>${data.location || ""}</td>
        <td>${data.destination || ""}</td>
        <td>${data.status || ""}</td>
        <td>${data.eta || ""}</td>
        <td class="actions">

          <button class="edit" onclick="editShipment('${d.id}')">Edit</button>
          <button class="delete" onclick="deleteShipment('${d.id}')">Delete</button>

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
};

// INIT
loadShipments();
