import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
getDocs,
doc,
setDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "diplomatic-courier-service.firebaseapp.com",
projectId: "diplomatic-courier-service"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// INPUTS
const tracking = document.getElementById("tracking");
const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const eta = document.getElementById("eta");
const shippedDate = document.getElementById("shippedDate");

// SAVE SHIPMENT (FULL ROUTE INCLUDED)
document.getElementById("saveBtn").addEventListener("click", async () => {

const id = tracking.value.trim();
if(!id) return;

await setDoc(doc(db,"shipments",id),{

customerName: customerName.value,
phone: phone.value,
address: address.value,

status: "Order Confirmed",
location: "Saudi Arabia",
destination: "Nigeria",
eta: eta.value,
shippedDate: shippedDate.value,

// 🌍 MULTI COUNTRY ROUTE ENGINE
route: [
  { name: "Saudi Arabia" },
  { name: "Egypt" },
  { name: "Nigeria" }
],

currentIndex: 0,
progress: 0,

updatedAt: Date.now()

});

loadDashboard();

});

// DASHBOARD
async function loadDashboard(){

const snap = await getDocs(collection(db,"shipments"));

let total=0, transit=0, delivered=0, pending=0;
let html="";

snap.forEach(d=>{

const x = d.data();
total++;

if(x.status==="In Transit") transit++;
else if(x.status==="Delivered") delivered++;
else pending++;

html += `
<tr>
<td>${d.id}</td>
<td>${x.customerName || ""}</td>
<td>${x.status}</td>
<td>${x.progress || 0}%</td>
</tr>
`;

});

document.getElementById("total").innerText=total;
document.getElementById("transit").innerText=transit;
document.getElementById("delivered").innerText=delivered;
document.getElementById("pending").innerText=pending;

document.getElementById("list").innerHTML=html;

}

loadDashboard();


// 🚚 GPS ENGINE (AUTO MOVE SHIPMENT)
async function gpsEngine(){

const snap = await getDocs(collection(db,"shipments"));

snap.forEach(async (d)=>{

const data = d.data();

if(!data.route) return;

let i = data.currentIndex || 0;

if(i >= data.route.length-1) return;

i++;

await updateDoc(doc(db,"shipments",d.id),{

currentIndex:i,
progress: Math.round((i/data.route.length)*100),
location:data.route[i].name,

status: i === data.route.length-1 ? "Delivered" : "In Transit"

});

});

}

setInterval(gpsEngine,5000);
