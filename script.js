import { db } from './firebase-config.js';

import {
collection,
onSnapshot,
addDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


const menuGrid = document.getElementById('menuGrid');
const searchBar = document.getElementById('searchBar');
const filterBtns = document.querySelectorAll('.filter-btn');

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let allMenuItems = [];
let cart = [];

/* =====================
FETCH MENU FROM FIREBASE
===================== */

onSnapshot(collection(db, "menuItems"), (snapshot) => {

allMenuItems = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

displayMenuItems(allMenuItems);

});


/* =====================
DISPLAY MENU
===================== */

function displayMenuItems(items){

let displayMenu = items.map(item => {

return `<article class="menu-card">

<img src="${item.imageURL}" class="food-img">

<div class="card-content">

<div class="card-header">

<h3>${item.name}
<span class="diet-icon ${item.vegOrNonVeg}"></span>
</h3>

<span class="price">₹${item.price}</span>

</div>

<p class="desc">${item.description}</p>

<button onclick="addToCart('${item.name}',${item.price})">
Add to Order
</button>

</div>

</article>`

}).join("");

menuGrid.innerHTML = displayMenu;

}


/* =====================
CART SYSTEM
===================== */

window.addToCart = function(name,price){

cart.push({name,price})

updateCart()

}

function updateCart(){

cartItemsEl.innerHTML=""

let total=0

cart.forEach(item=>{

let li=document.createElement("li")

li.innerText=`${item.name} - ₹${item.price}`

cartItemsEl.appendChild(li)

total+=item.price

})

cartTotalEl.innerText=total

cartCount.innerText=cart.length

}


/* =====================
OPEN CART
===================== */

cartBtn.onclick=()=>{

cartPanel.classList.toggle("open")

}


/* =====================
PLACE ORDER
===================== */

document.getElementById("placeOrderBtn").onclick=async()=>{

const table=document.getElementById("tableNumber").value

if(cart.length===0){

alert("Cart empty")

return

}

await addDoc(collection(db,"orders"),{

tableNumber:table,
items:cart,
total:cart.reduce((sum,item)=>sum+item.price,0),
time:new Date()

})

alert("Order placed successfully!")

cart=[]
updateCart()

}


/* =====================
SEARCH
===================== */

searchBar.addEventListener('keyup',(e)=>{

const search=e.target.value.toLowerCase()

const filtered=allMenuItems.filter(item=>

item.name.toLowerCase().includes(search)

)

displayMenuItems(filtered)

})


/* =====================
CATEGORY FILTER
===================== */

filterBtns.forEach(btn=>{

btn.addEventListener("click",e=>{

filterBtns.forEach(b=>b.classList.remove("active"))

e.target.classList.add("active")

const category=e.target.dataset.category

if(category==="all"){

displayMenuItems(allMenuItems)

}

else{

displayMenuItems(

allMenuItems.filter(item=>item.category===category)

)

}

})

})


/* =====================
FEEDBACK SYSTEM
===================== */

document.getElementById("submitFeedback").onclick=async()=>{

const name=document.getElementById("customerName").value
const rating=document.getElementById("rating").value
const review=document.getElementById("reviewText").value

await addDoc(collection(db,"feedback"),{

name,
rating,
review,
time:new Date()

})

alert("Thank you for your feedback!")

}
