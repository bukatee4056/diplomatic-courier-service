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

/* ---------------- MAP VARIABLES (UNCHANGED) ---------------- */
let map;
let marker;
let polyline;

/* ---------------- ROUTE COORDINATES ---------------- */
const geo = {
"yemen":[15.3694,44.1910],
"saudi arabia":[24.7136,46.6753],
"egypt":[30.0444,31.2357],
"nigeria":[6.5244,3.3792],
"ethiopia":[9.1450,40.4897]
};

/* ---------------- MAP FUNCTION (DO NOT TOUCH) ---------------- */
function initMap(route){

if(!route || route.length < 2) return;

const coords = route
.map(r => geo[r.trim().toLowerCase()])
.filter(Boolean);

if(map) map.remove();

map = L.map("map", {
center:[20,0],
zoom:2
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution:"Diplomatic Courier Service"
}).addTo(map);

polyline = L.polyline(coords,{color:"cyan"}).addTo(map);

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

const snap = await getDoc(doc(db,"shipments",id));

if(!snap.exists()){
result.innerHTML = "❌ Shipment not found";
return;
}

const d = snap.data();

/* ROUTE STRING FOR DISPLAY */
const routeText = Array.isArray(d.route) ? d.route.join(" → ") : "N/A";

/* ADDRESS FIX (BACK) */
const address = d.address || "N/A";

/* UI */
result.innerHTML = `
<div style="background:#111a2e;padding:15px;border-radius:12px;margin-top:15px;">

<h2>📦 Diplomatic Courier Service</h2>

<p><b>Customer:</b> ${d.customerName || "N/A"}</p>
<p><b>Phone:</b> ${d.phone || "N/A"}</p>

<p><b>Address:</b> ${address}</p>

<p><b>From:</b> ${d.location || "N/A"}</p>
<p><b>To:</b> ${d.destination || "N/A"}</p>

<p><b>Route:</b> ${routeText}</p>

<p><b>Status:</b> ${d.status || "N/A"}</p>
<p><b>Shipped:</b> ${d.shippedDate || "N/A"}</p>
<p><b>ETA:</b> ${d.eta || "N/A"}</p>

<hr>

<h3>🚚 Route Map</h3>

<div id="map" style="height:300px;border-radius:10px;"></div>

</div>
`;

/* LOAD MAP (UNCHANGED) */
setTimeout(()=>initMap(d.route),300);

});

});
