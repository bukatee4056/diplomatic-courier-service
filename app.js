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

window.addEventListener("DOMContentLoaded", () => {

  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  console.log("Page loaded OK");

  button.addEventListener("click", async () => {

    const trackingNumber = input.value.trim();
    console.log("Searching:", trackingNumber);

    const docRef = doc(db, "shipments", trackingNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();
      console.log("DATA FROM FIREBASE:", data);

const data = docSnap.data();

console.log("FIREBASE RAW DATA:", data);

result.innerHTML = JSON.stringify(data);

    } else {
      result.innerHTML = "Tracking number not found";
    }

  });

});