// Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });

    // Cart Elements
    const cartBtn = document.getElementById("cart-button");
    const cartBtnMobile = document.getElementById("cart-button-mobile");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartCount = document.getElementById("cart-count");
    const cartCountMobile = document.getElementById("cart-count-mobile");
    const cartItemsContainer = cartSidebar.querySelector("#cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    let cart = [];

    function updateCartCount() {
      cartCount.textContent = cart.length;
      if(cartCountMobile) cartCountMobile.textContent = cart.length;
    }

    function calculateCartTotal() {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function updateCartSidebar() {
      cartItemsContainer.innerHTML = "";
      if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
      } else {
        cart.forEach((item, idx) => {
          const div = document.createElement("div");
          div.className = "flex justify-between items-center border-b pb-2";
          div.innerHTML = `
            <div class="flex flex-col">
              <span class="font-semibold">${item.name}</span>
              <span class="text-sm text-gray-600">Shade/Size: ${item.size}</span>
              <span class="text-sm text-gray-700">$${item.price.toFixed(2)} × ${item.quantity}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button aria-label="Reduce quantity" class="text-xl font-bold px-2 rounded hover:bg-gray-200">&minus;</button>
              <span class="w-6 text-center">${item.quantity}</span>
              <button aria-label="Increase quantity" class="text-xl font-bold px-2 rounded hover:bg-gray-200">&plus;</button>
              <button aria-label="Remove item" class="text-red-600 font-bold ml-2 hover:text-red-800 text-xl">&times;</button>
            </div>
          `;
          const [btnDec, , btnInc, btnRemove] = div.querySelectorAll("button");
          btnDec.addEventListener("click", () => changeQuantity(idx, -1));
          btnInc.addEventListener("click", () => changeQuantity(idx, +1));
          btnRemove.addEventListener("click", () => removeFromCart(idx));
          cartItemsContainer.appendChild(div);
        });
      }
      cartTotalEl.textContent = calculateCartTotal().toFixed(2);
      updateCartCount();
    }

    function changeQuantity(index, delta) {
      const item = cart[index];
      item.quantity += delta;
      if(item.quantity <= 0) {
        cart.splice(index, 1);
      }
      updateCartSidebar();
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      updateCartSidebar();
    }

    function openCart() {
      cartSidebar.classList.add("open");
      cartOverlay.classList.add("show");
      cartOverlay.classList.remove("hidden");
      cartOverlay.classList.add("block");
      document.body.style.overflow = "hidden";
    }

    function closeCart() {
      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("show");
      cartOverlay.classList.remove("block");
      cartOverlay.classList.add("hidden");
      document.body.style.overflow = "";
    }

    cartBtn.addEventListener("click", () => {
      if(cartSidebar.classList.contains("open")) closeCart();
      else openCart();
    });

    if(cartBtnMobile) {
      cartBtnMobile.addEventListener("click", () => {
        if(cartSidebar.classList.contains("open")) closeCart();
        else openCart();
      });
    }

    cartOverlay.addEventListener("click", closeCart);

    checkoutBtn.addEventListener("click", () => {
      if(cart.length === 0) {
        alert("Your cart is empty. Add some items first.");
      } else {
        alert("Checkout is not implemented in this demo.");
      }
    });

    // Product modal elements
    const productCards = document.querySelectorAll(".product-card");
    const modal = document.getElementById("product-modal");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const modalImage = document.getElementById("modal-image");
    const sizeSelect = document.getElementById("size-select");
    const modalAddCartBtn = document.getElementById("modal-add-cart");
    const modalCloseBtn = document.getElementById("modal-close");

    let activeProduct = null;

    productCards.forEach(card => {
      card.addEventListener("click", () => {
        activeProduct = card;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const description = card.dataset.description;
        const sizes = JSON.parse(card.dataset.sizes);
        const image = card.dataset.image;

        modalName.textContent = name;
        modalDescription.textContent = description;
        modalPrice.textContent = `$${price.toFixed(2)}`;
        modalImage.src = image;
        modalImage.alt = name;

        // Clear and fill sizes select
        sizeSelect.innerHTML = "";
        sizes.forEach(sz => {
          const option = document.createElement("option");
          option.value = sz;
          option.textContent = sz;
          sizeSelect.appendChild(option);
        });

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });

      const addBtn = card.querySelector(".add-to-cart-btn");
      addBtn.addEventListener("click", e => {
        e.stopPropagation();
        card.click();
      });
    });

    modalCloseBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      activeProduct = null;
    });

    modal.addEventListener("click", e => {
      if(e.target === modal) {
        modalCloseBtn.click();
      }
    });

    modalAddCartBtn.addEventListener("click", () => {
      if(!activeProduct) return;
      const name = activeProduct.dataset.name;
      const price = parseFloat(activeProduct.dataset.price);
      const size = sizeSelect.value;
      const brand = activeProduct.dataset.brand || "";

      const existingIndex = cart.findIndex(item => item.name === name && item.size === size && item.brand === brand);
      if(existingIndex !== -1) {
        cart[existingIndex].quantity++;
      } else {
        cart.push({name, price, size, brand, quantity: 1});
      }
      updateCartSidebar();
      modalCloseBtn.click();
      openCart();
    });

    /************ Filters Logic **************/

    const brandFilters = document.querySelectorAll(".brand-filter");
    const priceFilters = document.querySelectorAll(".price-filter");
    const productsGrid = document.getElementById("products-grid");
    const products = Array.from(document.querySelectorAll(".product-card"));

    function filterProducts() {
      const selectedBrands = Array.from(brandFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      let selectedPrice = "all";
      priceFilters.forEach(rb => {
        if(rb.checked) selectedPrice = rb.value;
      });

      products.forEach(product => {
        const brand = product.dataset.brand;
        const price = parseFloat(product.dataset.price);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand);
        let priceMatch = false;
        switch(selectedPrice) {
          case "all":
            priceMatch = true;
            break;
          case "under20":
            priceMatch = price < 20;
            break;
          case "20to40":
            priceMatch = price >= 20 && price <= 40;
            break;
          case "above40":
            priceMatch = price > 40;
            break;
        }

        if(brandMatch && priceMatch){
          product.style.display = "";
        } else {
          product.style.display = "none";
        }
      });
    }

    brandFilters.forEach(cb => {
      cb.addEventListener("change", filterProducts);
    });
    priceFilters.forEach(rb => {
      rb.addEventListener("change", filterProducts);
    });

    filterProducts();

    // Filters toggle on mobile
    const filtersSidebar = document.getElementById("filters-sidebar");
    const filtersToggleBtn = document.getElementById("filters-toggle-btn");

    if(filtersToggleBtn){
      filtersToggleBtn.addEventListener("click", () => {
        if(filtersSidebar.style.display === "none" || !filtersSidebar.style.display){
          filtersSidebar.style.display = "block";
          filtersToggleBtn.innerHTML = 'Filters &#x25B2;';
        } else {
          filtersSidebar.style.display = "none";
          filtersToggleBtn.innerHTML = 'Filters &#x25BC;';
        }
      });
    }