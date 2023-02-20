//   ! variables
// ?DOM
// * modal var
const shoppingIcon = document.querySelector(".shopping");
const modal = document.querySelector(".modal");
const modalplace = document.querySelector(".modal-list-container");
const confirmBtn = document.querySelector(".modal-btn-confirm");
const clearBtn = document.querySelector(".modal-btn-clear");
const iconNumAlert = document.querySelector(".items-in-cart-icon-qunatity");
let PriceContainer = document.querySelector(".total-price span");

// * product details
const pickedPImage = document.querySelector(".product-image-picked-img");
const productTitle = document.querySelector(".item-name-head");
const priceInfo = document.querySelector(".l-price-info");
const material = document.querySelector(".l-material-info");

// ?others
const shopPage = document.querySelector(".l-main-shop");
let cart = [];
let DOMbtn = [];

import { productsData } from "./product.js";

//  !event listener
document.addEventListener("DOMContentLoaded", DOMFunc);
shoppingIcon.addEventListener("click", openModal);
confirmBtn.addEventListener("click", confirmModal);
shopPage.addEventListener("click", showItem);

// !classes
// get products
class rProducts {
  getData() {
    return productsData;
  }
}
// this class dsiplay the producst
class UI {
  static showItem(item) {
    let result = "";
    item.forEach((e) => {
      result += ` 
      <div class="shop-products ">
      <img class="product-img ${e.id}" src="${e.src}" alt="" />
      <p>${e.title}</p>
      <span>${e.price} USD</span>
      <button class="add-product-btn" data-id="${e.id}">Add item</button>
      </div>`;
      shopPage.innerHTML = result;
    });
  }

  static addModal() {
    const addBtnsArr = [...document.querySelectorAll(".add-product-btn")];
    DOMbtn = addBtnsArr;
    addBtnsArr.forEach((btn) => {
      // const allInCart = storage.whatsInCart();
      const id = btn.dataset.id;
      const isInCart = cart.find((e) => JSON.stringify(e.id) === id);

      if (isInCart) {
        btn.innerText = "In cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (clikcedBtn) => {
        btn.innerText = "In cart";
        btn.disabled = true;

        const selectedItemId = storage.getItemselected(id);
        let addedProducts = { ...selectedItemId, quantity: 1 };

        cart = [...cart, addedProducts];
        storage.addedCart(cart);
        this.totalPrice(cart);
        this.addItemToModal(addedProducts);

      });
    });
  }

  static totalPrice(cart) {
    let mainQuantity = 0;

    let totalPrice = cart.reduce((total, each) => {
      mainQuantity += each.quantity
       total += each.price * each.quantity;
       return total
    },0);
    iconNumAlert.innerHTML = mainQuantity>0?mainQuantity:"";
    PriceContainer.innerHTML = totalPrice;
  }
  static addItemToModal(item) {
    let value = document.createElement("div");

    value.innerHTML = `
    <div class="modal-list-item" data-id="${item.id}">
    <img src=" ${item.src} " alt=""/>
    <div class="modal-list-item-detail">
    <p>${item.title}</p>
    <p><span>${item.price} USD</span></p>
    </div>
    <div class="modal-list-item-quantity">
    <i class="fa fa-arrow-up plus"></i><span class="modal-list-item-quantitys" >${item.quantity}</span
    ><i class="fa fa-arrow-down minus"></i>
    </div>
    <div class="modal-list-item-remover"><i class='fa fa-trash trashI'></i></div>
    </div> `;

    modalplace.appendChild(value);
  }
  static appLoad() {
    cart = storage.WhatsInCart() || [];
    cart.forEach((item) => this.addItemToModal(item));
  }
  static logic() {
    clearBtn.addEventListener("click", () => {
      cart.forEach((e) => this.remover(e.id));
    });

    modal.addEventListener("click", (e) => {
      let allIcons = e.target.classList;
      let pId = parseFloat(e.target.parentElement.parentElement.dataset.id);
      let same = cart.filter((each) => parseFloat(pId) === each.id);


      // this is for trash icon
      if (allIcons.contains("trashI")) {
        this.remover(pId);
      }
      // this is for arrow up icon
      else if (allIcons.contains("plus")) {
        same.filter((total) => {
          total.quantity++;
          e.target.nextElementSibling.innerText = total.quantity;
        });
      }
      // this is for arrow down btn
      else if (allIcons.contains("minus")) {
        same.forEach((total) => {
          total.quantity = total.quantity > 0 ? total.quantity - 1 : 0;
          e.target.previousElementSibling.innerText = total.quantity;
        });
      }
      storage.addedCart(cart);
      this.totalPrice(cart);
    });
  }
  static remover(e) {
    cart = cart.filter((all) => all.id !== e);
    storage.addedCart(cart);
    this.totalPrice(cart);

    const allAdded = document.querySelectorAll(".modal-list-item");
    let allAddedArr = [...allAdded];
    allAddedArr.forEach((each) => {
      if (parseFloat(each.dataset.id) === e) {
        each.remove();
      }
    });

    // this change the buttons to normal
    const buttons = DOMbtn.find((btn) => parseFloat(btn.dataset.id) === e);
    buttons.innerText = "Add item";
    buttons.disabled = false;
  }
}

// local storage
class storage {
  static saveItem(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getItemselected(tagetP) {
    const getItem = JSON.parse(localStorage.getItem("products"));
    return (getItem.find((storageP) => tagetP == parseInt(storageP.id)))||[];
  }

  static addedCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static WhatsInCart() {
    const getItem = JSON.parse(localStorage.getItem("cart"));
    return getItem;
  }
}

//  ! functions
function openModal() {
  modal.style.display = "block";
}

function confirmModal() {
  modal.style.display = "none";
}

function showItem(item) {
  const targetClass = [...item.target.classList];
  const targetSrc = item.target.src;

  // *this is for when user click on img
  if (targetClass.includes("product-img")) {
    const sameImg = productsData.filter((e) => targetSrc.includes(e.src));

    for (let arr of sameImg) {
      pickedPImage.src = arr.src;
      productTitle.innerHTML = arr.title;
      priceInfo.innerHTML = arr.price;
      material.innerHTML = arr.material;
    }
  }
}

function DOMFunc() {
  const objProducts = new rProducts();
  const rProductsData = objProducts.getData();

  UI.showItem(rProductsData);
  UI.appLoad();
  UI.totalPrice(cart);
  UI.addModal();
  UI.logic();

}
