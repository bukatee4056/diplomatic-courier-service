import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "diplomatic-courier-service.firebaseapp.com",
projectId: "diplomatic-courier-service"
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

window.addEventListener("DOMContentLoaded",()=>{

const btn=document.getElementById("trackBtn");
const input=document.getElementById("trackingInput");
const result=document.getElementById("result");

let map, marker, routeLine;

function initMap(route){

map = L.map("map").setView([20,0],2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

routeLine = L.polyline(route,{color:"cyan"}).addTo(map);

marker = L.marker(route[0]).addTo(map);
}

function moveMarker(route,i){
if(marker){
marker.setLatLng(route[i]);
map.panTo(route[i]);
}
}

btn.addEventListener("click",async()=>{

const id=input.value.trim();
if(!id) return;

const snap=await getDoc(doc(db,"shipments",id));
if(!snap.exists()) return;

const d=snap.data();
const step=getStep(d.status);

// convert route to map coordinates (demo fallback)
const routeCoords = [
[30.0444,31.2357], // Egypt
[24.7136,46.6753], // Saudi Arabia
[6.5244,3.3792]    // Nigeria
];

setTimeout(()=>initMap(routeCoords),300);

let i=0;
setInterval(()=>{
if(i<routeCoords.length-1){
i++;
moveMarker(routeCoords,i);
}
},3000);

result.innerHTML=`

<div class="card">

<h2>📦 ${id}</h2>

<div class="grid">

<div class="box">
<div class="label">Customer</div>
<div class="value">${d.customerName}</div>
</div>

<div class="box">
<div class="label">Phone</div>
<div class="value">${d.phone}</div>
</div>

<div class="box">
<div class="label">Route</div>
<div class="value">${d.location} → ${d.destination}</div>
</div>

<div class="box">
<div class="label">Status</div>
<div class="value">${d.status}</div>
</div>

<div class="box">
<div class="label">Shipped Date</div>
<div class="value">${d.shippedDate}</div>
</div>

<div class="box">
<div class="label">ETA</div>
<div class="value">${d.eta}</div>
</div>

</div>

<h3>🚚 Tracking Progress</h3>

<div class="step ${step>=1?'active':''}">Order Confirmed</div>
<div class="step ${step>=2?'active':''}">Package Picked Up</div>
<div class="step ${step>=3?'active':''}">In Transit</div>
<div class="step ${step>=4?'active':''}">Out for Delivery</div>
<div class="step ${step>=5?'active':''}">Delivered</div>

<div id="map"></div>

<button class="download" onclick="downloadPDF('${id}')">
⬇ Download Receipt
</button>

</div>
`;

window.downloadPDF = async (id)=>{

const snap=await getDoc(doc(db,"shipments",id));
const d=snap.data();

const { jsPDF } = window.jspdf;
const pdf=new jsPDF();

pdf.text("SHIPPING RECEIPT",10,10);
pdf.text("Tracking: "+id,10,20);
pdf.text("Customer: "+d.customerName,10,30);
pdf.text("Phone: "+d.phone,10,40);
pdf.text("Route: "+d.location+" → "+d.destination,10,50);
pdf.text("Status: "+d.status,10,60);
pdf.text("ETA: "+d.eta,10,70);

pdf.save(id+".pdf");

};

});

});
