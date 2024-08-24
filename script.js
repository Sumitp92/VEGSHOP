const apiUrl = 'https://crudcrud.com/api/600d00a2ddd145cba9b0f4f5d20d8ef5/vegetables';

// Load cart and total count from CRUDCRUD or local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalCount = parseInt(localStorage.getItem('totalCount')) || 0;

window.onload = function() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        cart = data;
        totalCount = cart.length;
        updateCart();
    })
    .catch(error => {
        console.error('Error fetching data from CRUDCRUD:', error);
        // Fallback to local storage data in case of an error
        updateCart();
    });
};

function addToShop() {
    const name = document.getElementById('veg-name').value.trim();
    const price = parseFloat(document.getElementById('veg-price').value);
    const quantity = parseInt(document.getElementById('veg-qty').value);

    if (name && price > 0 && quantity > 0) {
        const existingItem = cart.find(item => item.name.toLowerCase() === name.toLowerCase());

        if (existingItem) {
            existingItem.quantity += quantity;
            updateVegetable(existingItem._id, existingItem); // Update existing item in CRUDCRUD
        } else {
            const vegetable = { name, price, quantity };
            postVegetable(vegetable); // Add new item to CRUDCRUD
        }

        totalCount++;
        updateCart();
        clearInputs();
    } else {
        alert('Please enter valid details');
    }
}

function postVegetable(vegetable) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vegetable),
    })
    .then(response => response.json())
    .then(data => {
        cart.push(data); // Add the new vegetable to the local cart array
        updateCart();
    })
    .catch(error => {
        console.error('Error adding vegetable to CRUDCRUD:', error);
    });
}

function updateVegetable(id, updatedVegetable) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVegetable),
    })
    .then(() => {
        updateCart();
    })
    .catch(error => {
        console.error('Error updating vegetable in CRUDCRUD:', error);
    });
}

function deleteVegetable(index) {
    const id = cart[index]._id;
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        cart.splice(index, 1);
        totalCount--;
        updateCart();
    })
    .catch(error => {
        console.error('Error deleting vegetable from CRUDCRUD:', error);
    });
}

function updateCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = ''; // Clear the cart before updating

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.innerHTML = `
            <span>${item.name} RS: ${item.price} ${item.quantity}KG</span>
            <input type="number" value="1" min="1" id="qty-${index}">
            <button onclick="buyItem(${index})">Buy</button>
            <button onclick="deleteVegetable(${index})">Delete</button>
        `;
        cartDiv.appendChild(cartItemDiv);
    });

    document.getElementById('total-count').innerText = totalCount;

    // Save to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalCount', totalCount);
}

function buyItem(index) {
    const newQuantity = parseInt(document.getElementById(`qty-${index}`).value);
    if (newQuantity && newQuantity > 0) {
        if (newQuantity > cart[index].quantity) {
            alert('Quantity exceeds available amount');
            return;
        }
        cart[index].quantity -= newQuantity;
        if (cart[index].quantity <= 0) {
            deleteVegetable(index);
        } else {
            updateVegetable(cart[index]._id, cart[index]); // Update in CRUDCRUD
            updateCart();
        }
    } else {
        alert('Please enter a valid quantity');
    }
}

function clearInputs() {
    document.getElementById('veg-name').value = '';
    document.getElementById('veg-price').value = '';
    document.getElementById('veg-qty').value = '';
}
