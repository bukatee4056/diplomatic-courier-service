import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------------- FIREBASE ---------------- */
const firebaseConfig = {
apiKey: "AIzaSyAwjcKxnViESMXyCzhML2sZPbA_HBzytMg",
authDomain: "diplomatic-courier-service.firebaseapp.com",
projectId: "diplomatic-courier-service"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ---------------- MAP ---------------- */
let map;
let marker;
let polyline;

/* ---------------- COUNTRY COORDINATES ---------------- */
const geo = {
"yemen":[15.3694,44.1910],
"saudi arabia":[24.7136,46.6753],
"egypt":[30.0444,31.2357],
"nigeria":[6.5244,3.3792],
"ethiopia":[9.1450,40.4897],
"sudan":[15.5007,32.5599],
"jordan":[31.9632,35.9304]
};

/* ---------------- MAP (NO USER LOCATION EVER) ---------------- */
function initMap(route){

if(!route || route.length < 2){
console.log("Invalid route");
return;
}

const coords = route
.map(r => geo[r.trim().toLowerCase()])
.filter(Boolean);

if(coords.length < 2){
console.log("Invalid coordinates");
return;
}

if(map){
map.remove();
}

/* 🚨 FIXED WORLD VIEW (NO GPS / NO USER LOCATION) */
map = L.map("map", {
center: [20,0],
zoom: 2,
zoomControl: true
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution: "Courier Tracking System"
}).addTo(map);

polyline = L.polyline(coords,{
color:"cyan",
weight:4
}).addTo(map);

marker = L.marker(coords[0]).addTo(map);

map.fitBounds(polyline.getBounds(), {
padding:[30,30]
});
}

/* ---------------- TRACKING ---------------- */
window.addEventListener("DOMContentLoaded", ()=>{

const btn = document.getElementById("trackBtn");
const input = document.getElementById("trackingInput");
const result = document.getElementById("result");

btn.addEventListener("click", async ()=>{

const id = input.value.trim();

if(!id){
result.innerHTML = "❌ Enter tracking number";
return;
}

try {

const snap = await getDoc(doc(db,"shipments",id));

if(!snap.exists()){
result.innerHTML = "❌ Shipment not found";
return;
}

const d = snap.data();
const route = Array.isArray(d.route) ? d.route : [];

result.innerHTML = `
<div style="background:#111a2e;padding:15px;border-radius:10px;margin-top:15px;">

<h2>📦 Diplomatic Courier Service</h2>

<p><b>Customer:</b> ${d.customerName || "N/A"}</p>
<p><b>Phone:</b> ${d.phone || "N/A"}</p>
<p><b>From:</b> ${d.location || "N/A"}</p>
<p><b>To:</b> ${d.destination || "N/A"}</p>
<p><b>Status:</b> ${d.status || "N/A"}</p>
<p><b>Shipped:</b> ${d.shippedDate || "N/A"}</p>
<p><b>ETA:</b> ${d.eta || "N/A"}</p>

<hr>

<h3>🚚 Route Map</h3>

<div id="map" style="height:300px;border-radius:10px;"></div>

<button onclick="downloadPDF('${id}')" style="margin-top:10px;width:100%;padding:10px;background:#2563eb;color:white;border:none;border-radius:8px;">
⬇ Download Receipt
</button>

</div>
`;

setTimeout(()=>initMap(route),300);

} catch(e){
console.error(e);
result.innerHTML = "❌ Error loading shipment";
}

});

/* ---------------- PDF ---------------- */
window.downloadPDF = async (id)=>{

const snap = await getDoc(doc(db,"shipments",id));
const d = snap.data();

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

pdf.text("Courier Service Receipt",10,10);
pdf.text("Tracking: " + id,10,20);
pdf.text("Customer: " + (d.customerName||""),10,30);
pdf.text("Phone: " + (d.phone||""),10,40);
pdf.text("From: " + (d.location||""),10,50);
pdf.text("To: " + (d.destination||""),10,60);
pdf.text("Status: " + (d.status||""),10,70);

pdf.save(id+".pdf");

};

});
