const products = [
{
    id:1,
    name:"Matte Lipstick",
    brand:"Maybelline",
    price:599,
    image:"https://placehold.co/300x350/pink/white?text=Lipstick"
},
{
    id:2,
    name:"Fit Me Foundation",
    brand:"Maybelline",
    price:799,
    image:"https://placehold.co/300x350/f8d7da/000?text=Foundation"
},
{
    id:3,
    name:"Eyeshadow Palette",
    brand:"Huda Beauty",
    price:1499,
    image:"https://placehold.co/300x350/e6ccff/000?text=Eyeshadow"
},
{
    id:4,
    name:"Waterproof Mascara",
    brand:"Lakme",
    price:499,
    image:"https://placehold.co/300x350/cccccc/000?text=Mascara"
},
{
    id:5,
    name:"Compact Powder",
    brand:"Lakme",
    price:699,
    image:"https://placehold.co/300x350/f5deb3/000?text=Powder"
},
{
    id:6,
    name:"Blush Kit",
    brand:"Kay Beauty",
    price:899,
    image:"https://placehold.co/300x350/ffb6c1/000?text=Blush"
}
];

let cart = [];

const productContainer = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const total = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const search = document.getElementById("search");
const sort = document.getElementById("sort");

function displayProducts(productList){

    productContainer.innerHTML="";

    productList.forEach(product=>{

        productContainer.innerHTML+=`

        <div class="card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <p>${product.brand}</p>

            <h2>₹${product.price}</h2>

            <button onclick="addToCart(${product.id})">
            Add to Cart
            </button>

        </div>

        `;

    });

}

displayProducts(products);

function addToCart(id){

    const product=products.find(item=>item.id===id);

    cart.push(product);

    updateCart();

}

function updateCart() {

    cartItems.innerHTML = "";

    let totalPrice = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>No products added.</p>";

    } else {

        cart.forEach((item, index) => {

            totalPrice += item.price;

            cartItems.innerHTML += `

            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

            `;

        });

    }

    total.textContent = totalPrice;
    cartCount.textContent = cart.length;

}
function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

search.addEventListener("keyup",function(){

    const keyword=this.value.toLowerCase();

    const filtered=products.filter(product=>

        product.name.toLowerCase().includes(keyword) ||

        product.brand.toLowerCase().includes(keyword)

    );

    displayProducts(filtered);

});

sort.addEventListener("change",function(){

    let sorted=[...products];

    if(this.value==="low-high"){

        sorted.sort((a,b)=>a.price-b.price);

    }

    else if(this.value==="high-low"){

        sorted.sort((a,b)=>b.price-a.price);

    }

    else if(this.value==="name"){

        sorted.sort((a,b)=>a.name.localeCompare(b.name));

    }

    displayProducts(sorted);

});

document.getElementById("place-order").addEventListener("click", function () {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert("🎉 Order Placed Successfully!\nThank you for shopping with OPAL-AURA.");

    cart = [];

    updateCart();

});

document.getElementById("cancel-order").addEventListener("click", function () {

    if (cart.length === 0) {

        alert("No order to cancel.");

        return;

    }

    let choice = confirm("Are you sure you want to cancel your order?");

    if (choice) {

        cart = [];

        updateCart();

        alert("Order Cancelled.");

    }

});
updateCart();