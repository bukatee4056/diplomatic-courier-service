import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "diplomatic-courier-service.firebaseapp.com",
projectId: "diplomatic-courier-service"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function step(status){
return {
"Order Confirmed":1,
"In Transit":2,
"Delivered":3
}[status] || 0;
}

window.addEventListener("DOMContentLoaded",()=>{

const btn=document.getElementById("trackBtn");
const input=document.getElementById("trackingInput");
const result=document.getElementById("result");

btn.addEventListener("click",async()=>{

const id=input.value.trim();
if(!id) return;

const snap=await getDoc(doc(db,"shipments",id));
if(!snap.exists()) return;

const d=snap.data();
const s=step(d.status);

const route = (d.route || []).map(r=>r.name).join(" → ");

result.innerHTML=`

<div style="background:#111a2e;padding:20px;border-radius:12px">

<h2>📦 ${id}</h2>

<p>👤 ${d.customerName}</p>
<p>📞 ${d.phone}</p>
<p>📍 ${route}</p>

<p>📦 Status: ${d.status}</p>
<p>📅 Shipped: ${d.shippedDate}</p>
<p>⏰ ETA: ${d.eta}</p>

<hr>

<p ${s>=1?'style="color:lime"':''}>✔ Order Confirmed</p>
<p ${s>=2?'style="color:lime"':''}>🚚 In Transit</p>
<p ${s>=3?'style="color:lime"':''}>🏁 Delivered</p>

</div>

`;

});

});
