import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const msg = document.getElementById("msg");

// SAVE BUTTON
document.getElementById("saveBtn").addEventListener("click", async () => {

  const id = tracking.value.trim();

  if (!id) {
    msg.innerText = "❌ Enter tracking number";
    return;
  }

  if (!status.value || !location.value || !destination.value || !eta.value) {
    msg.innerText = "❌ Please fill all required fields";
    return;
  }

  try {
    await setDoc(doc(db, "shipments", id), {
      status: status.value,
      location: location.value,
      destination: destination.value,
      eta: eta.value,
      shippedDate: shippedDate.value || "",
      updatedAt: Date.now()
    });

    msg.innerText = "✅ Shipment saved successfully!";

    // Optional: clear form after save
    tracking.value = "";
    status.value = "";
    location.value = "";
    destination.value = "";
    eta.value = "";
    shippedDate.value = "";

  } catch (error) {
    console.error(error);
    msg.innerText = "❌ Error saving shipment";
  }

});
