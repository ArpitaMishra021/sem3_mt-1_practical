
let allProducts = [];

// ASYNC - Display all products
async function displayProducts() {

    try {
        const response = await fetch('/products');

        const data = await response.json();

        allProducts = data.products;


        showProducts(allProducts);

    } catch (error) {
        alert("Error loading products!");
        console.log(error);
    }
}

// DOM MANIPULATION - Display products in table
function showProducts(products) {

    const list = document.getElementById('productList');

    list.innerHTML = '';

    products.forEach((p) => {

        list.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td>${p.category}</td>

                <td>
                    <button class="edit"
                        onclick="editProduct('${p.id}')">
                        Edit
                    </button>

                    <button class="delete"
                        onclick="deleteProduct('${p.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });
}

// CREATE - Add Product
function addProduct() {

    const product = {
        id: document.getElementById('id').value.trim(),
        name: document.getElementById('name').value.trim(),
        price: document.getElementById('price').value,
        category: document.getElementById('category').value.trim()
    };

    if (!product.id || !product.name ||
        !product.price || !product.category ||
        Number(product.price) <= 0) {

        alert("Please enter valid product details!");
        return;
    }

    fetch('/add', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(product)

    })
    .then(response => response.json())
    .then(data => {

        alert(data.message);

        if (data.message === "Product added successfully!") {
            clearForm();
            displayProducts();
        }

    })
    .catch(error => {
        console.log(error);
        alert("Error adding product!");
    });

}

// READ - Display Products
// Already implemented through displayProducts()

// EDIT - Fill form with existing details
function editProduct(id) {

    const product = allProducts.find(p => p.id == id);

    if (product) {

        document.getElementById('id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;

    }

}

// UPDATE - Update Product
function updateProduct() {

    const id = document.getElementById('id').value.trim();

    const product = {
        name: document.getElementById('name').value.trim(),
        price: document.getElementById('price').value,
        category: document.getElementById('category').value.trim()
    };

    if (!id || !product.name || !product.price ||
        !product.category || Number(product.price) <= 0) {

        alert("Please enter valid product details!");
        return;
    }

    fetch('/update/' + id, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(product)

    })
    .then(response => response.json())
    .then(data => {

        alert(data.message);

        if (data.message === "Product updated successfully!") {
            clearForm();
            displayProducts();
        }

    })
    .catch(error => {
        console.log(error);
        alert("Error updating product!");
    });

}

// DELETE - Delete Product
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    fetch('/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {

        alert(data.message);
        displayProducts();

    })
    .catch(error => {
        console.log(error);
        alert("Error deleting product!");
    });

}

// CLEAR - Empty input fields
function clearForm() {

    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('category').value = '';

}

// Load products when page opens
displayProducts();
