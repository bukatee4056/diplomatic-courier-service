import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection
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

/* 🔐 protect admin page */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

/* INPUTS */
const tracking = document.getElementById("tracking");
const status = document.getElementById("status");
const location = document.getElementById("location");
const destination = document.getElementById("destination");
const eta = document.getElementById("eta");
const route = document.getElementById("route");
const msg = document.getElementById("msg");

const tableBody = document.getElementById("tableBody");

/* SAVE SHIPMENT */
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();

  if (!id) {
    msg.innerText = "Enter tracking number";
    return;
  }

  await setDoc(doc(db, "shipments", id), {
    status: status.value,
    location: location.value,
    destination: destination.value,
    eta: eta.value,
    route: route.value.split(",").map(r => r.trim()),
    updatedAt: Date.now()
  });

  msg.innerText = "Saved successfully";
  loadData();
});

/* LOAD ALL SHIPMENTS */
async function loadData() {

  tableBody.innerHTML = "";

  const snap = await getDocs(collection(db, "shipments"));

  snap.forEach(d => {
    const data = d.data();

    tableBody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${data.status}</td>
        <td>${data.location}</td>
        <td>${data.destination}</td>
        <td>${data.eta}</td>
      </tr>
    `;
  });
}

/* SEARCH SHIPMENT */
document.getElementById("searchBtn").addEventListener("click", async () => {

  const id = document.getElementById("search").value.trim();

  const snap = await getDoc(doc(db, "shipments", id));

  if (!snap.exists()) {
    msg.innerText = "Not found";
    return;
  }

  const d = snap.data();

  tableBody.innerHTML = `
    <tr>
      <td>${id}</td>
      <td>${d.status}</td>
      <td>${d.location}</td>
      <td>${d.destination}</td>
      <td>${d.eta}</td>
    </tr>
  `;
});

loadData();
