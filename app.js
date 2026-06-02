import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "diplomatic-courier-service.firebaseapp.com",
projectId: "diplomatic-courier-service"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// STATUS STEPS
function getStep(status){
const s = (status||"").toLowerCase();
if(s==="order confirmed") return 1;
if(s==="package picked up") return 2;
if(s==="in transit") return 3;
if(s==="out for delivery") return 4;
if(s==="delivered") return 5;
return 0;
}

// MAP
let map, marker, polyline;

function initMap(route){
if(map) map.remove();

map = L.map("map").setView(route[0],4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

polyline = L.polyline(route,{color:"cyan"}).addTo(map);
marker = L.marker(route[0]).addTo(map);

map.fitBounds(polyline.getBounds());
}

// MULTI COUNTRY ROUTES
const routeDB = {
"saudi arabia-egypt": ["Saudi Arabia","Jordan","Egypt"],
"yemen-egypt": ["Yemen","Saudi Arabia","Egypt"],
"saudi arabia-nigeria": ["Saudi Arabia","Sudan","Nigeria"],
"yemen-nigeria": ["Yemen","Ethiopia","Nigeria"]
};

// COORDINATES
const geo = {
"yemen":[15.3694,44.1910],
"saudi arabia":[24.7136,46.6753],
"jordan":[31.9632,35.9304],
"sudan":[15.5007,32.5599],
"egypt":[30.0444,31.2357],
"nigeria":[6.5244,3.3792],
"ethiopia":[9.1450,40.4897]
};

window.addEventListener("DOMContentLoaded",()=>{

const btn = document.getElementById("trackBtn");
const input = document.getElementById("trackingInput");
const result = document.getElementById("result");

btn.addEventListener("click", async ()=>{

const id = input.value.trim();
if(!id) return;

const snap = await getDoc(doc(db,"shipments",id));
if(!snap.exists()){
result.innerHTML="Not Found";
return;
}

const d = snap.data();

const routeNames =
d.route && d.route.length
? d.route
: routeDB[`${d.location.toLowerCase()}-${d.destination.toLowerCase()}`] || [];

const route = routeNames.map(c=>geo[c.toLowerCase()] || [0,0]);

const step = getStep(d.status);

result.innerHTML = `
<div class="card">

<h2>📦 Diplomatic Courier Service</h2>

<div class="grid">

<div class="box"><div class="label">Customer</div><div class="value">${d.customerName}</div></div>
<div class="box"><div class="label">Phone</div><div class="value">${d.phone}</div></div>
<div class="box"><div class="label">Location</div><div class="value">${d.location}</div></div>
<div class="box"><div class="label">Destination</div><div class="value">${d.destination}</div></div>
<div class="box"><div class="label">Shipped</div><div class="value">${d.shippedDate}</div></div>
<div class="box"><div class="label">ETA</div><div class="value">${d.eta}</div></div>
<div class="box"><div class="label">Status</div><div class="value">${d.status}</div></div>
<div class="box"><div class="label">Address</div><div class="value">${d.address}</div></div>

</div>

<h3>🌍 Route</h3>
${routeNames.map(r=>`<div class="step active">📍 ${r}</div>`).join("")}

<h3>⏰ Progress</h3>
<div class="step ${step>=1?'active':''}">Order Confirmed</div>
<div class="step ${step>=2?'active':''}">Picked Up</div>
<div class="step ${step>=3?'active':''}">In Transit</div>
<div class="step ${step>=4?'active':''}">Out for Delivery</div>
<div class="step ${step>=5?'active':''}">Delivered</div>

<div id="map"></div>

<button class="download" onclick="downloadPDF('${id}')">
⬇ Download Receipt
</button>

</div>
`;

setTimeout(()=>initMap(route),300);

// PDF
window.downloadPDF=async(id)=>{
const s=await getDoc(doc(db,"shipments",id));
const d=s.data();
const {jsPDF}=window.jspdf;
const pdf=new jsPDF();

pdf.text("Diplomatic Courier Service",10,10);
pdf.text("Tracking:"+id,10,20);
pdf.text("Customer:"+d.customerName,10,30);
pdf.text("Phone:"+d.phone,10,40);
pdf.text("From:"+d.location,10,50);
pdf.text("To:"+d.destination,10,60);
pdf.text("Status:"+d.status,10,70);
pdf.text("ETA:"+d.eta,10,80);

pdf.save(id+".pdf");
};

});

});
