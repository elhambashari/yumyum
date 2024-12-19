const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";
console.log("Request URL:", apiUrl + "/keys");

const apiKey = "yum-fPTHpvozwrJ7H2FT";
console.log("API Key:", apiKey);

const tenantName = "Elham";
console.log("Tenant Name:", tenantName);

const apiKeyContainer = document.getElementById("api-key-container");
console.log("API Key Container:", apiKeyContainer);
const tenantContainer = document.getElementById("tenant-container");
console.log("Tenant Container:", tenantContainer);
const buttonApiKey = document.getElementById("button-apikey");
console.log("Button API Key:", buttonApiKey);
const buttonTenant = document.getElementById("button-tenant");
console.log("Button Tenant:", buttonTenant);

async function getKey() {
  console.log("Fetching API key...");

  try {
    const options = { method: "POST" };
    const response = await fetch(apiUrl + "/keys", options);
    console.log("Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Key Data:", data);

    apiKeyContainer.innerText = `API Key: ${data.key}`;
  } catch (error) {
    console.error("Error fetching API Key:", error);
    apiKeyContainer.innerText = `Error fetching API Key: ${error.message}`;
  }
}

// Anropa menu-funktionen
menu();

async function menu() {
  // console.log("menu funciton. api key: " + apiKey);
  // try {
  const options = {
    headers: {
      "x-zocom": apiKey,
    },
  };
  console.log("Menu ska skicka request till: " + apiUrl + "/menu");
  console.log("Med options: ", options);
  const response = await fetch(apiUrl + "/menu", options);
  console.log("Response Status:", response.status);
  const data = await response.json();
  console.log("Detta får vi från servern:", data);
  // TODO: här ska du sätta värdet på ITEMS
  // DATA är ett objekt, som innehåller ITEMS
  // ITEMS är en array/lista, som innehåller objekt
  ITEMS = data.items
  renderMenu(ITEMS);
  // TODO: anropa renderMenu med ITEMS

  
}

async function getTenant() {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": apiKey,
      },
      body: JSON.stringify({ name: "Elham" }),
    };
    const response = await fetch(apiUrl + "/tenants", options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Tenant Data:", data);

    tenantContainer.innerText = `Tenant ID: ${data.id}, Tenant Name: ${data.name}`;
  } catch (error) {
    console.error("Error fetching Tenant:", error);
    tenantContainer.innerText = `Error fetching Tenant: ${error.message}`;
  }
}

buttonApiKey.addEventListener("click", getKey);
buttonTenant.addEventListener("click", getTenant);

let cart = [];

const menuContainer = document.getElementById("menu-items");

// TODO: vänta med att köra forEach tills vi har hämtat alla menu items
let ITEMS = [];
function renderMenu(items) {
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
	
  
    div.innerHTML = `
          <div class="menu-item">
              <span class="name">${item.name}</span>
              <span class="dots"></span>
              <span class="price">${item.price} SEK</span>
          </div>
          <p class="ingredients">${item.ingredients?.join(", ") || ""}</p>
      `;
	 
  
    menuContainer.appendChild(div);
	
  
    // Event listener for clicks
    div.addEventListener("click", () => {
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
	 
      updateCart();
      updateCartBadge();
	 
    });
	
  });
}

function addToCart(item) {
  cart.push(item);
  console.log("First Item in Cart:", cart[0]);
}

// Update cart display
function updateCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  cartContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ${item.price} SEK</p>
            <p>Quantity: <span class="quantity">${item.quantity}</span></p>
            <button data-index="${index}" class="remove-from-cart">Remove</button>
            <button data-index="${index}" class="increase-quantity">+</button>
            <button data-index="${index}" class="decrease-quantity">-</button>
        `;
    cartContainer.appendChild(div);
    totalPrice += item.price * item.quantity;
  });

  totalPriceElem.textContent = totalPrice;
}







// Update cart badge
function updateCartBadge() {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartBadge = document.getElementById("cart-badge");

  if (itemCount > 0) {
    cartBadge.textContent = itemCount;
    cartBadge.classList.remove("hidden");
  } else {
    cartBadge.classList.add("hidden");
  }
}

// Handle click on the cart icon (SVG)
document.getElementById("cart-icon-container").addEventListener("click", () => {
  navigateToPage("order");
});

// Increase quantity of an item in the cart
document.getElementById("cart-items").addEventListener("click", (e) => {
  if (e.target.classList.contains("increase-quantity")) {
    const index = Number(e.target.dataset.index);
    cart[index].quantity += 1;
    updateCart();
  } else if (e.target.classList.contains("decrease-quantity")) {
    const index = Number(e.target.dataset.index);
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      updateCart();
    }
  } else if (e.target.classList.contains("remove-from-cart")) {
    const index = Number(e.target.dataset.index);
    cart.splice(index, 1);
    updateCart();
    updateCartBadge();
  }
});











   


// Place order and reset cart
document.getElementById("place-order").addEventListener("click", async() => {
	const cartItems = cart.map(item => {

		return item.id
			
	});

	
	const options = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"x-zocom": apiKey,  
		},
		body: JSON.stringify({ items: cartItems }),
	};
	console.log("cart är:",cart);

	const response = await fetch(apiUrl + "/6prt/orders", options);
	
	console.log("Cart Items:", cartItems);
	
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	
	const data = await response.json();
	console.log("Response Data:", data);
	// Console check
	console.log("Order ID:", data.id);
	



	







async function fetchETA() {
    try {
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-zocom": apiKey,
            },
        };

        const etaResponse = await fetch(apiUrl + "/6prt/orders", options);
		console.log("Response Status:", etaResponse.status);

        if (!etaResponse.ok) {
            throw new Error(`HTTP error! Status: ${etaResponse.status}`);
        }

        const etaData = await etaResponse.json();
        console.log("ETA Response Data:", etaData);
    } catch (error) {
        console.error("Error fetching ETA:", error);
    }
}

  

  


// Show Faktur page
function showFaktur() {
	document
	  .querySelectorAll(".page")
	  .forEach((section) => section.classList.remove("active"));
	document.getElementById("faktur").classList.add("active");
  }
  





  function showReceipt(orderId, eta) {
    console.log('Order ID:', orderId); 
	//console.log("ETA:", eta);
    const receiptText = document.getElementById('confirmation-text');
    receiptText.innerHTML = `
        Order ID: ${orderId}<br><br>
		<strong>ETA: ${eta}</strong> 
    `;
    navigateToPage('faktur');

}






	async function postOrder() {
		try {
		  
		  const options = {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			  "x-zocom": apiKey,
			},
		  };
	  
		 // const data = await response.json();
		  const orderId = data.order.id 
	  
	      console.log("Order ID fetched from items:", data);
		  let returnObject = {
			id: data.order.id,
			eta: data.order.eta
		}
		return returnObject;
		} catch (error) {
		  console.error("Error fetching orderId:", error);
		  return null; 
		}
	  }
	  
  


  
cart = [];
const orderId = await postOrder();
 const eta = await fetchETA(); 
 showReceipt(orderId, eta)
 updateCart();
 updateCartBadge();
 showFaktur();
});







const backButton = document.getElementById("back-to-menu");

if (backButton) {
  backButton.addEventListener("click", () => {
    navigateToPage("menu");
  });
}





function navigateToPage(pageId) {
	document
	  .querySelectorAll(".page")
	  .forEach((section) => section.classList.remove("active"));
	document.getElementById(pageId).classList.add("active");
  }
  



// New order
document.getElementById("new-order").addEventListener("click", () => {
  resetApp();
  navigateToPage("menu");
});













function updateReceipt() {
  console.log("Cart Contents Before Updating Receipt:", cart);

  const receiptContainer = document.getElementById("receipt-container");
  receiptContainer.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    console.log("The cart is empty!");
  }

  cart.forEach((item) => {
    console.log("Item Price:", item.price);
    console.log("Item Quantity:", item.quantity);
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ${item.price} SEK</p>
            <p>Quantity: ${item.quantity}</p>
        `;
    receiptContainer.appendChild(div);
    totalPrice += item.price * item.quantity;
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "total-price";
  totalDiv.innerHTML = `<h3>Total: ${totalPrice} SEK</h3>`;
  receiptContainer.appendChild(totalDiv);
}



// Reset app state for a new order
function resetApp() {
  cart = [];
 
  updateCart();
  updateCartBadge();
}
