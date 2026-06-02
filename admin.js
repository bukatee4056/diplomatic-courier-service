import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "YOUR_KEY",
  authDomain: "diplomatic-courier-service.firebaseapp.com",
  projectId: "diplomatic-courier-service"
});

const db = getFirestore(app);

const list = document.getElementById("list");

// LOAD SHIPMENTS
async function load() {

  const snap = await getDocs(collection(db, "shipments"));
  list.innerHTML = "";

  snap.forEach(docSnap => {

    const d = docSnap.data();
    const id = docSnap.id;

    list.innerHTML += `
    <div class="card">

      <h3>${id}</h3>

      <div class="grid">

        <div>
          <div class="small">Customer</div>
          <input id="c-${id}" value="${d.customerName || ""}">
        </div>

        <div>
          <div class="small">Phone</div>
          <input id="p-${id}" value="${d.phone || ""}">
        </div>

        <div>
          <div class="small">Location</div>
          <input id="l-${id}" value="${d.location || ""}">
        </div>

        <div>
          <div class="small">Destination</div>
          <input id="d-${id}" value="${d.destination || ""}">
        </div>

        <div>
          <div class="small">Status</div>
          <input id="s-${id}" value="${d.status || ""}">
        </div>

        <div>
          <div class="small">ETA</div>
          <input id="e-${id}" value="${d.eta || ""}">
        </div>

        <div>
          <div class="small">Shipped Date</div>
          <input id="sd-${id}" value="${d.shippedDate || ""}">
        </div>

        <div>
          <div class="small">Route (comma separated)</div>
          <input id="r-${id}" value="${(d.route || []).join(",")}">
        </div>

      </div>

      <button class="update" onclick="update('${id}')">✏ Update</button>
      <button class="delete" onclick="removeDoc('${id}')">🗑 Delete</button>

    </div>
    `;
  });
}

// UPDATE
window.update = async (id) => {

  await updateDoc(doc(db, "shipments", id), {

    customerName: document.getElementById("c-"+id).value,
    phone: document.getElementById("p-"+id).value,
    location: document.getElementById("l-"+id).value,
    destination: document.getElementById("d-"+id).value,
    status: document.getElementById("s-"+id).value,
    eta: document.getElementById("e-"+id).value,
    shippedDate: document.getElementById("sd-"+id).value,

    route: document.getElementById("r-"+id).value.split(","),

    updatedAt: Date.now()
  });

  alert("Updated ✔");
};

// DELETE
window.removeDoc = async (id) => {

  if(confirm("Delete shipment?")){
    await deleteDoc(doc(db,"shipments",id));
    alert("Deleted ✔");
    load();
  }
};

load();
