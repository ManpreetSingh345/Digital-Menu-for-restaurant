import { db } from './firebase-config.js';
import { 
    collection, addDoc, onSnapshot, doc, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com"; // Fixed URL

/* =====================
1. ADD MENU ITEM (ImageURL Removed)
===================== */
const menuForm = document.getElementById('menuForm');
menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newItem = {
        name: document.getElementById('foodName').value,
        category: document.getElementById('foodCategory').value,
        price: parseInt(document.getElementById('foodPrice').value),
        vegOrNonVeg: document.getElementById('foodType').value,
        description: document.getElementById('foodDesc').value,
        createdAt: serverTimestamp()
    };

    try {
        await addDoc(collection(db, "menuItems"), newItem);
        alert("Dish added successfully!");
        menuForm.reset();
    } catch (err) { alert("Error: " + err.message); }
});

/* =====================
2. LIVE ORDERS LISTENER
===================== */
const ordersGrid = document.getElementById('ordersGrid');
onSnapshot(collection(db, "orders"), (snapshot) => {
    ordersGrid.innerHTML = snapshot.empty ? "<p>No active orders.</p>" : "";
    
    snapshot.forEach(orderDoc => {
        const order = orderDoc.data();
        const id = orderDoc.id;
        
        // Handle Firestore Timestamp conversion
        const time = order.time ? new Date(order.time.seconds * 1000).toLocaleTimeString() : "Just now";

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>Table ${order.tableNumber || "N/A"}</h3>
            <p class="order-list"><strong>Items:</strong> ${order.items ? order.items.map(i => i.name).join(", ") : "No items"}</p>
            <p><strong>Total:</strong> ₹${order.total || 0}</p>
            <small>Ordered at: ${time}</small>
            <button class="btn-complete" onclick="completeOrder('${id}')">Complete Order</button>
        `;
        ordersGrid.appendChild(card);
    });
});

/* =====================
3. FEEDBACK LISTENER
===================== */
const feedbackGrid = document.getElementById('feedbackGrid');
onSnapshot(collection(db, "feedback"), (snapshot) => {
    feedbackGrid.innerHTML = snapshot.empty ? "<p>No feedback received yet.</p>" : "";
    snapshot.forEach(feedDoc => {
        const feed = feedDoc.data();
        const id = feedDoc.id;

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>Rating: ${"⭐".repeat(feed.rating || 0)}</h3>
            <p>"${feed.review || "No comment"}"</p>
            <small>- ${feed.name || "Anonymous"}</small>
            <button class="btn-delete" onclick="deleteFeedback('${id}')">Delete Feedback</button>
        `;
        feedbackGrid.appendChild(card);
    });
});

/* =====================
GLOBAL FUNCTIONS FOR BUTTONS
===================== */
window.completeOrder = async (id) => {
    if(confirm("Served this order? This will remove it from the list.")) {
        try {
            await deleteDoc(doc(db, "orders", id));
        } catch (err) { alert(err.message); }
    }
};

window.deleteFeedback = async (id) => {
    if(confirm("Remove this feedback?")) {
        try {
            await deleteDoc(doc(db, "feedback", id));
        } catch (err) { alert(err.message); }
    }
};
