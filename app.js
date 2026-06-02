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

window.addEventListener("load", function () {

  const button = document.querySelector("button");
  const result = document.getElementById("result");

  button.addEventListener("click", async function () {

    const trackingNumber = document.querySelector("input").value.trim();

    if (!trackingNumber) {
      result.innerHTML = "Please enter a tracking number.";
      return;
    }

    const docRef = doc(db, "shipments", trackingNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

result.innerHTML = `
  <h3>Status: ${data.Status}</h3>
  <p><strong>Location:</strong> ${data.Location}</p>
  <p><strong>Destination:</strong> ${data.Destination}</p>
  <p><strong>ETA:</strong> ${data.ETA}</p>
`;
    } else {
      result.innerHTML = "Tracking number not found.";
    }

  });

});