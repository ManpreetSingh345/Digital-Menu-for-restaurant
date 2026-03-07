// 1. Import the database from your config file
import { db } from './firebase-config.js';
// 2. Import required Firestore functions
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const menuGrid = document.getElementById('menuGrid');
const searchBar = document.getElementById('searchBar');
const filterBtns = document.querySelectorAll('.filter-btn');

// This variable will store our data globally so filtering and searching still work
let allMenuItems = [];

// 3. FETCH DATA IN REAL-TIME
// This "onSnapshot" function listens to your Firebase collection
onSnapshot(collection(db, "menuItems"), (snapshot) => {
    // Map the Firebase documents into a clean array
    allMenuItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // Display the items immediately when data arrives
    displayMenuItems(allMenuItems);
});

// 4. Function to render items (Updated to use Firebase field names)
function displayMenuItems(items) {
    if (items.length === 0) {
        menuGrid.innerHTML = `<p style="text-align:center; width:100%;">No items found.</p>`;
        return;
    }

    let displayMenu = items.map((item) => {
        // We use || to provide a fallback if a field is missing in Firebase
        return `<article class="menu-card">
                    <img src="${item.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${item.name}" class="food-img">
                    <div class="card-content">
                        <div class="card-header">
                            <h3>${item.name} <span class="diet-icon ${item.vegOrNonVeg || 'veg'}"></span></h3>
                            <span class="price">₹${item.price}</span>
                        </div>
                        <p class="desc">${item.description || 'No description available.'}</p>
                    </div>
                </article>`;
    }).join("");
    
    menuGrid.innerHTML = displayMenu;
}

// 5. Category Filtering (Updated to use the 'allMenuItems' from Firebase)
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const category = e.currentTarget.dataset.category;
        
        if (category === "all") {
            displayMenuItems(allMenuItems);
        } else {
            const filteredCategory = allMenuItems.filter(item => item.category === category);
            displayMenuItems(filteredCategory);
        }
    });
});

// 6. Search Functionality (Updated to use the 'allMenuItems' from Firebase)
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredItems = allMenuItems.filter(item => {
        return (
            item.name.toLowerCase().includes(searchString) || 
            (item.description && item.description.toLowerCase().includes(searchString))
        );
    });
    displayMenuItems(filteredItems);
});