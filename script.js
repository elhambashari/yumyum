let cart = []; // Cart array to store items

// Update cart count in the icon
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show order summary on the order page
function renderOrderSummary() {
    const orderSummaryContainer = document.getElementById('orderSummary');
    orderSummaryContainer.innerHTML = ''; // Clear previous content
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h3>${item.name} (${item.quantity} st) - ${item.price * item.quantity} kr</h3>
        `;
        orderSummaryContainer.appendChild(itemElement);
    });

    const totalElement = document.createElement('div');
    totalElement.innerHTML = `<h3>Total: ${totalPrice} kr</h3>`;
    orderSummaryContainer.appendChild(totalElement);
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartCount();
    updateCartView();
}

// Render the cart details
function updateCartView() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.name} (${item.quantity} st) - ${item.price * item.quantity} kr</p>
            <button class="decrease" data-id="${item.id}">-</button>
            <button class="increase" data-id="${item.id}">+</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotal.textContent = `Totalt: ${totalPrice} kr`;











	// Handle the payment when the user clicks the "Betala" button
document.getElementById("payOrder").addEventListener("click", () => {
    // You can show a confirmation message, clear the cart, or redirect to a payment page
    alert("Tack för din beställning! Du har betalat. Vi kommer att behandla din order.");
    
    // Optionally, clear the cart and reset everything after payment
    cart = []; // Empty the cart
    updateCartCount(); // Reset cart icon count to 0
    updateCartView(); // Reset the cart details view
    showView("receipt"); // Show the receipt page
    renderReceipt(); // Render the receipt after payment
});




    // Event listeners for increase and decrease buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
        });
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const item = cart.find(cartItem => cartItem.id === itemId);
            addToCart(item);
        });
    });
}

// Remove item from cart
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity === 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartCount();
    updateCartView();
}

function renderMenu() {
    const menuItems = [
        { id: 1, name: 'Kyckling Wonton', price: 40, image: 'bild.img/image.png' },
        { id: 2, name: 'Vegetarisk Wonton', price: 35, image: 'bild.img/wonton.jpg' },
        { id: 3, name: 'Chilisås', price: 10, image: 'bild.img/dip.jpg' },
        { id: 4, name: 'Läsk', price: 20, image: 'bild.img/OIP.jpg' },
    ];

    const menuItemsContainer = document.getElementById('menuItems');
    menuItemsContainer.innerHTML = '';

    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-image">
            <div>
                <p>${item.name}</p>
                <p>${item.price} kr</p>
                <button class="addToCart" data-id="${item.id}">Lägg till</button>
            </div>
        `;
        menuItemsContainer.appendChild(itemElement);
    });

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.addToCart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const item = menuItems.find(item => item.id === itemId);
            addToCart(item);
        });
    });
}


// Show the relevant view
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(viewName).classList.remove('hidden');
}

// Complete order and show receipt
function completeOrder() {
    // Show receipt with order summary
    renderReceipt();
    showView('receipt');
}

// Render receipt details with a personalized thank you message
function renderReceipt() {
    const receiptContainer = document.getElementById('receiptDetails');
    receiptContainer.innerHTML = ''; // Clear previous content
    let totalPrice = 0;

    // Add a personalized thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.innerHTML = `
        <h2>Tack Elham för din beställning!</h2>
        <p>Välkommen åter!</p>
        <hr>
    `;
    receiptContainer.appendChild(thankYouMessage);

    // Add order summary
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h3>${item.name} (${item.quantity} st) - ${item.price * item.quantity} kr</h3>
        `;
        receiptContainer.appendChild(itemElement);
    });

    // Add total price
    const totalElement = document.createElement('div');
    totalElement.innerHTML = `
        <h3>Total: ${totalPrice} kr</h3>
        <hr>
    `;
    receiptContainer.appendChild(totalElement);

    // Optionally, you can add a footer or additional message
    const footerMessage = document.createElement('div');
    footerMessage.innerHTML = `
        <p>Tack för att du har valt oss!</p>
    `;
    receiptContainer.appendChild(footerMessage);
}





// Event listeners for page transitions
document.getElementById('goToCart').addEventListener('click', () => {
    showView('cart');
});

document.getElementById('backToMenu').addEventListener('click', () => {
    showView('menu');
});


document.getElementById('goToOrder').addEventListener('click', () => {
    renderOrderSummary(); // Render order summary before going to the order page
    showView('order');
});

document.getElementById('placeOrder').addEventListener('click', () => {
    completeOrder(); // Complete the order and show the receipt
});

document.getElementById('cartIcon').addEventListener('click', () => {
    renderOrderSummary(); // Render order summary before going to the order page
    showView('order');
});

document.getElementById('backToMenuFromReceipt').addEventListener('click', () => {
    showView('menu');
});

// Initialize
renderMenu();
updateCartCount();
updateCartView();
