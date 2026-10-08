let cart = JSON.parse(localStorage.getItem("freshCart")) || [];

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartItemsCount = document.getElementById("cartItemsCount");


// ================= CART OPEN/CLOSE =================

document.getElementById("openCart").addEventListener("click", () => {
    cartDrawer.classList.add("show");
    cartOverlay.classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function closeCart() {
    cartDrawer.classList.remove("show");
    cartOverlay.classList.remove("show");
}


// ================= ADD TO CART =================

document.querySelectorAll(".add-btn").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        saveCart();

        cartDrawer.classList.add("show");
        cartOverlay.classList.add("show");

    });

});


// ================= SAVE CART =================

function saveCart() {

    localStorage.setItem(
        "freshCart",
        JSON.stringify(cart)
    );

    renderCart();

}


// ================= RENDER CART =================

function renderCart() {

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    cartCount.innerText = totalItems;
    cartItemsCount.innerText =
        `${totalItems} ${totalItems === 1 ? "item" : "items"}`;

    cartTotal.innerText =
        `₹${totalPrice.toLocaleString("en-IN")}`;


    if (cart.length === 0) {

        cartBody.innerHTML = `
            <div class="empty-cart">

                <i class="bi bi-cart-x"></i>

                <h4>Your cart is empty</h4>

                <p>
                    Add some fresh groceries to get started.
                </p>

            </div>
        `;

        return;
    }


    cartBody.innerHTML = "";

    cart.forEach((item, index) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h5>${item.name}</h5>

                <strong>
                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>

                <div class="qty-controls">

                    <button onclick="changeQuantity(${index}, -1)">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                    <button class="remove-item"
                            onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;

        cartBody.appendChild(cartItem);

    });

}


// ================= QUANTITY =================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();

}


// ================= REMOVE =================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

}


// ================= WISHLIST =================

document.querySelectorAll(".wishlist").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        const icon = button.querySelector("i");

        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");

    });

});


// ================= PRODUCT FILTER =================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const products =
    document.querySelectorAll(".product-item");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        products.forEach(product => {

            if (
                filter === "all" ||
                product.dataset.category === filter
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

});


// ================= SEARCH =================

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const search =
        searchInput.value.toLowerCase().trim();

    products.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        if (name.includes(search)) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

});


// ================= CATEGORY CLICK =================

document.querySelectorAll(".category-card")
.forEach(category => {

    category.addEventListener("click", () => {

        const selectedCategory =
            category.dataset.category;

        document.querySelector("#products")
            .scrollIntoView({
                behavior: "smooth"
            });

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

            if (btn.dataset.filter === selectedCategory) {
                btn.classList.add("active");
            }

        });

        products.forEach(product => {

            product.style.display =
                product.dataset.category === selectedCategory
                    ? ""
                    : "none";

        });

    });

});


// ================= INITIAL CART =================

renderCart();