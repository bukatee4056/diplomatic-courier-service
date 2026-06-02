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

/* ---------------- MAP VARIABLES ---------------- */
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

/* ---------------- MAP FUNCTION (SAFE - NO USER LOCATION) ---------------- */
function initMap(route){

if(!route || route.length < 2) return;

const coords = route
.map(r => geo[r.trim().toLowerCase()])
.filter(Boolean);

if(map){
map.remove();
}

/* FORCE GLOBAL VIEW */
map = L.map("map", {
center:[20,0],
zoom:2
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution:"Logistics Tracking System"
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

/* ---------------- MAIN TRACKING ---------------- */
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

/* ROUTE TEXT */
const routeText = Array.isArray(d.route) ? d.route.join(" → ") : "N/A";

/* FULL PREMIUM UI */
result.innerHTML = `
<div style="
max-width:650px;
margin:auto;
background:linear-gradient(145deg,#0b1220,#0f172a);
padding:22px;
border-radius:18px;
box-shadow:0 15px 40px rgba(0,0,0,0.5);
color:white;
font-family:Arial;
">

<h2 style="text-align:center;margin-bottom:15px;">
📦 Logistics Tracking System
</h2>

<div style="background:#111a2e;padding:12px;border-radius:12px;text-align:center;margin-bottom:12px;">
<b>Status:</b> ${d.status || "Processing"}
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>Customer</b><br>${d.customerName || "N/A"}
</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>Phone</b><br>${d.phone || "N/A"}
</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>From</b><br>${d.location || "N/A"}
</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>To</b><br>${d.destination || "N/A"}
</div>

</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;margin-top:12px;">
<b>Address</b><br>${d.address || "N/A"}
</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;margin-top:12px;">
<b>Route</b><br><span style="color:#38bdf8;">${routeText}</span>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>Shipped Date</b><br>${d.shippedDate || "N/A"}
</div>

<div style="background:#111a2e;padding:12px;border-radius:12px;">
<b>ETA</b><br>${d.eta || "N/A"}
</div>

</div>

<h3 style="margin-top:15px;">Route Map</h3>

<div id="map" style="height:320px;border-radius:14px;margin-top:10px;"></div>

</div>
`;

setTimeout(()=>initMap(d.route),300);

} catch(err){
console.error(err);
result.innerHTML = "❌ Error loading shipment";
}

});

});
