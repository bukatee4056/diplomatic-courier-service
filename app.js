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

function getStep(status){
  return {
    "Order Confirmed":1,
    "Package Picked Up":2,
    "In Transit":3,
    "Out for Delivery":4,
    "Delivered":5
  }[status] || 0;
}

window.addEventListener("DOMContentLoaded", () => {

const btn = document.getElementById("trackBtn");
const input = document.getElementById("trackingInput");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {

const id = input.value.trim();
if(!id) return;

const snap = await getDoc(doc(db,"shipments",id));

if(!snap.exists()){
result.innerHTML="Not found";
return;
}

const d = snap.data();
const step = getStep(d.status);

// MAP ROUTE (simple simulation)
setTimeout(() => {
  const map = L.map('map').setView([20,0],2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  const route = [
    [30.0444,31.2357],
    [24.7136,46.6753]
  ];

  const marker = L.marker(route[0]).addTo(map);

  let i = 0;
  setInterval(()=>{
    if(i < route.length){
      marker.setLatLng(route[i]);
      i++;
    }
  },2000);

  L.polyline(route,{color:'cyan'}).addTo(map);

},200);

result.innerHTML = `

<div class="card">

<h2>📦 ${id}</h2>

<div class="grid">

<div class="box"><div class="label">Customer</div><div class="value">${d.customerName}</div></div>
<div class="box"><div class="label">Phone</div><div class="value">${d.phone}</div></div>
<div class="box"><div class="label">Route</div><div class="value">${d.location} → ${d.destination}</div></div>
<div class="box"><div class="label">Status</div><div class="value">${d.status}</div></div>
<div class="box"><div class="label">Shipped</div><div class="value">${d.shippedDate}</div></div>
<div class="box"><div class="label">ETA</div><div class="value">${d.eta}</div></div>

</div>

<h3>🚚 Tracking Progress</h3>

<div class="step ${step>=1?'active':''}">Order Confirmed</div>
<div class="step ${step>=2?'active':''}">Package Picked Up</div>
<div class="step ${step>=3?'active':''}">In Transit</div>
<div class="step ${step>=4?'active':''}">Out for Delivery</div>
<div class="step ${step>=5?'active':''}">Delivered</div>

<div id="map"></div>

<button onclick="downloadPDF('${id}','${d.customerName}','${d.status}','${d.location}','${d.destination}','${d.eta}')">
Download Receipt
</button>

</div>
`;

window.downloadPDF = (id,name,status,from,to,eta)=>{
const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

pdf.text("GLOBAL SHIPPING RECEIPT",10,10);
pdf.text("Tracking: "+id,10,20);
pdf.text("Customer: "+name,10,30);
pdf.text("Status: "+status,10,40);
pdf.text("Route: "+from+" -> "+to,10,50);
pdf.text("ETA: "+eta,10,60);

pdf.save(id+".pdf");
};

});

});
