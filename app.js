"use strict";
// Set to the restaurant's verified international number (digits only) before launch.
// An empty value uses WhatsApp's contact chooser, not an invented business number.
const RESTAURANT_WHATSAPP = "";
const menu = [
  {
    id: "kacchi",
    name: "Old Dhaka Kacchi",
    bn: "পুরান ঢাকার কাচ্চি",
    description:
      "Fragrant basmati, tender mutton and golden potatoes. Slow-cooked the old Dhaka way.",
    bnDescription:
      "সুগন্ধি বাসমতি, নরম খাসির মাংস আর সোনালি আলু। পুরান ঢাকার ঐতিহ্যবাহী স্বাদ।",
    price: 450,
    category: "signature",
    image: "biryani",
    badge: "HOUSE FAVOURITE",
    bnBadge: "আমাদের বিশেষ",
    portion: "per serving",
    bnPortion: "প্রতি পরিবেশন",
    veg: false,
    allergens: "Milk",
  },
  {
    id: "bhuna",
    name: "Beef Kala Bhuna",
    bn: "গরুর কালা ভুনা",
    description:
      "Rich, deeply spiced beef, patiently cooked with caramelised onions. A Chattogram classic.",
    bnDescription:
      "ক্যারামেল করা পেঁয়াজ ও মসলায় ধীরে রান্না করা গরুর মাংস। চট্টগ্রামের ঐতিহ্য।",
    price: 380,
    category: "signature",
    image: "curry",
    badge: "CHEF’S PICK",
    bnBadge: "শেফের পছন্দ",
    portion: "per serving",
    bnPortion: "প্রতি পরিবেশন",
    veg: false,
    allergens: "Mustard",
  },
  {
    id: "ilish",
    name: "Shorshe Ilish",
    bn: "সরষে ইলিশ",
    description:
      "Our beloved hilsa in a bold mustard gravy, finished with fresh green chillies.",
    bnDescription: "ঝাঁঝালো সরষের ঝোলে প্রিয় ইলিশ, সঙ্গে কাঁচামরিচের ঘ্রাণ।",
    price: 520,
    category: "mains",
    image: "fish",
    badge: "A BENGALI CLASSIC",
    bnBadge: "বাঙালির প্রিয়",
    portion: "2 pieces",
    bnPortion: "২ পিস",
    veg: false,
    allergens: "Fish, mustard",
  },
  {
    id: "roast",
    name: "Chicken Roast",
    bn: "চিকেন রোস্ট",
    description:
      "Tender chicken in a silky onion and yoghurt gravy. A celebration on every plate.",
    bnDescription:
      "পেঁয়াজ ও দইয়ের মোলায়েম গ্রেভিতে নরম মুরগির রোস্ট। প্রতি পাতে উৎসব।",
    price: 280,
    category: "mains",
    image: "chicken",
    badge: "COMFORT FOOD",
    bnBadge: "চেনা স্বাদ",
    portion: "2 pieces",
    bnPortion: "২ পিস",
    veg: false,
    allergens: "Milk",
  },
  {
    id: "doi",
    name: "Mishti Doi",
    bn: "মিষ্টি দই",
    description:
      "Creamy, gently caramelised sweet yoghurt, set the traditional way in an earthen pot.",
    bnDescription:
      "মাটির ভাঁড়ে পাতা ঘন, মোলায়েম মিষ্টি দই। ঐতিহ্যের মিষ্টি সমাপ্তি।",
    price: 120,
    category: "sweet",
    image: "dessert",
    badge: "SWEET & SIMPLE",
    bnBadge: "মিষ্টি সমাপ্তি",
    portion: "per pot",
    bnPortion: "প্রতি ভাঁড়",
    veg: true,
    allergens: "Milk, pistachio",
  },
  {
    id: "borhani",
    name: "Mint Borhani",
    bn: "পুদিনা বোরহানি",
    description:
      "A cool, spiced yoghurt drink with fresh mint. Your biryani’s favourite companion.",
    bnDescription:
      "পুদিনা ও মসলায় তৈরি ঠান্ডা দইয়ের শরবত। বিরিয়ানির সেরা সঙ্গী।",
    price: 90,
    category: "drinks",
    image: "borhani",
    badge: "FRESHLY MADE",
    bnBadge: "সদ্য তৈরি",
    portion: "per glass",
    bnPortion: "প্রতি গ্লাস",
    veg: true,
    allergens: "Milk, mustard",
  },
];
const $ = (selector) => document.querySelector(selector);
let selectedCategory = "all";
let bengali = false;
let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem("mati-cart") || "{}");
  if (saved && typeof saved === "object")
    for (const dish of menu) {
      if (
        Number.isInteger(saved[dish.id]) &&
        saved[dish.id] > 0 &&
        saved[dish.id] <= 20
      )
        cart[dish.id] = saved[dish.id];
    }
} catch {
  /* Storage can be unavailable in private browsing. */
}
const money = (amount) =>
  "৳" + new Intl.NumberFormat(bengali ? "bn-BD" : "en-BD").format(amount);
const categoryNames = {
  all: "ALL GOOD THINGS",
  signature: "SIGNATURE DISHES",
  mains: "BENGALI MAINS",
  sweet: "SWEET ENDINGS",
  drinks: "DRINKS",
};
const bnCategories = {
  all: "সব খাবার",
  signature: "বিশেষ পদ",
  mains: "বাঙালি রান্না",
  sweet: "মিষ্টিমুখ",
  drinks: "পানীয়",
};
function renderCategoryLabels() {
  const labels = {
    all: "All dishes",
    signature: "Signature dishes",
    mains: "Bengali mains",
    sweet: "Sweet endings",
    drinks: "Drinks",
  };
  document.querySelectorAll(".category").forEach((button) => {
    const category = button.dataset.category;
    button.textContent = bengali ? bnCategories[category] : labels[category];
    button.lang = bengali ? "bn" : "en";
    if (category === "all") {
      const count = document.createElement("span");
      count.textContent = new Intl.NumberFormat(bengali ? "bn-BD" : "en-BD", {
        minimumIntegerDigits: 2,
      }).format(menu.length);
      button.append(" ", count);
    }
  });
}
function renderMenu() {
  const term = $("#search").value.trim().toLocaleLowerCase();
  const dishes = menu.filter(
    (dish) =>
      (selectedCategory === "all" || dish.category === selectedCategory) &&
      (!$("#vegetarian").checked || dish.veg) &&
      `${dish.name} ${dish.bn} ${dish.description} ${dish.bnDescription}`
        .toLocaleLowerCase()
        .includes(term),
  );
  $("#menu-grid").innerHTML = dishes
    .map(
      (dish, index) =>
        `<article class="food-card" style="animation-delay:${index * 35}ms"><div class="food-image"><img src="assets/${dish.image}-small.webp" alt="${dish.name}" width="680" height="453" loading="lazy" decoding="async"><span class="food-badge ${dish.id === "kacchi" ? "house" : ""}" ${bengali ? 'lang="bn"' : ""}>${bengali ? dish.bnBadge : dish.badge}</span></div><div class="food-body"><div class="food-title-row"><h3 ${bengali ? 'lang="bn" style="font-family:Bengali;font-size:20px"' : ""}>${bengali ? dish.bn : dish.name}</h3>${dish.veg ? '<span class="diet-indicator" title="Vegetarian" aria-label="Vegetarian">◉</span>' : ""}</div><p class="food-bn" lang="${bengali ? "en" : "bn"}">${bengali ? dish.name : dish.bn}</p><p class="food-description" ${bengali ? 'lang="bn" style="font-family:Bengali"' : ""}>${bengali ? dish.bnDescription : dish.description}</p><div class="food-bottom"><span class="price">${money(dish.price)}<span class="portion">${bengali ? dish.bnPortion : dish.portion}</span></span><button class="add-button" data-add="${dish.id}" aria-label="Add ${dish.name} to your order">${bengali ? "যোগ করুন" : "Add to order"}<span aria-hidden="true">+</span></button></div></div></article>`,
    )
    .join("");
  $("#results-count").textContent = bengali
    ? `${bnCategories[selectedCategory]} · ${new Intl.NumberFormat("bn-BD").format(dishes.length)}টি পদ`
    : `${categoryNames[selectedCategory]} · ${dishes.length} ${dishes.length === 1 ? "DISH" : "DISHES"}`;
  $("#empty-state").hidden = dishes.length > 0;
}
function saveCart() {
  try {
    localStorage.setItem("mati-cart", JSON.stringify(cart));
  } catch {
    /* Keep session basket if storage is blocked. */
  }
  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
  $(".bag-count").textContent = count;
  $(".float-count").textContent = count;
  $(".float-count").hidden = count === 0;
  $(".bag-button").setAttribute(
    "aria-label",
    `View your order, ${count} items`,
  );
  $("#order-preview").hidden = true;
}
let toastTimeout;
function notify(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => $("#toast").classList.remove("show"), 2500);
}
function addToCart(id) {
  if (!menu.some((dish) => dish.id === id)) return;
  if ((cart[id] || 0) >= 20) {
    notify("Maximum 20 of each dish per demo order.");
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  notify(
    `${bengali ? menu.find((dish) => dish.id === id).bn : menu.find((dish) => dish.id === id).name} ${bengali ? "যোগ করা হয়েছে" : "added to your order"}`,
  );
}
function renderOrder() {
  const dishes = menu.filter((dish) => cart[dish.id]);
  $("#order-summary").hidden = dishes.length === 0;
  $("#order-items").innerHTML = dishes.length
    ? dishes
        .map(
          (dish) =>
            `<div class="order-row"><img src="assets/${dish.image}-small.webp" alt="" width="62" height="62"><div class="order-row-content"><h3>${dish.name}</h3><p>${money(dish.price)} each</p><p>Contains: ${dish.allergens}</p></div><div class="quantity"><button data-adjust="${dish.id}" data-delta="-1" aria-label="Remove one ${dish.name}">−</button><span aria-label="Quantity">${cart[dish.id]}</span><button data-adjust="${dish.id}" data-delta="1" aria-label="Add one ${dish.name}" ${cart[dish.id] >= 20 ? "disabled" : ""}>+</button></div></div>`,
        )
        .join("")
    : '<div class="empty-bag"><h3>Good things await.</h3><p>Your table is empty. Find a favourite on our menu.</p><button class="button primary" id="browse-menu">Explore the menu ↗</button></div>';
  $("#subtotal").textContent = money(
    dishes.reduce((total, dish) => total + dish.price * cart[dish.id], 0),
  );
  $("#browse-menu")?.addEventListener("click", () => {
    closeDialog($("#order-dialog"));
    $("#menu").scrollIntoView({ behavior: "smooth" });
  });
}
function openDialog(dialog) {
  dialog.showModal();
  document.body.style.overflow = "hidden";
}
function closeDialog(dialog) {
  dialog.close();
}
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector(".close-dialog")
    .addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeDialog(dialog);
  });
});
document.querySelectorAll("[data-open-order]").forEach((button) =>
  button.addEventListener("click", () => {
    renderOrder();
    openDialog($("#order-dialog"));
  }),
);
$("#menu-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
$("#order-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-adjust]");
  if (!button) return;
  const id = button.dataset.adjust;
  cart[id] = Math.min(
    20,
    Math.max(0, (cart[id] || 0) + Number(button.dataset.delta)),
  );
  if (!cart[id]) delete cart[id];
  saveCart();
  renderOrder();
  const nextButton = [
    ...$("#order-items").querySelectorAll("[data-adjust]"),
  ].find(
    (el) =>
      el.dataset.adjust === id &&
      el.dataset.delta === button.dataset.delta &&
      !el.disabled,
  );
  (nextButton || $("#order-items button") || $(".close-dialog")).focus();
});
document.querySelectorAll(".category").forEach((button) =>
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".category").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderMenu();
  }),
);
$("#search").addEventListener("input", renderMenu);
$("#vegetarian").addEventListener("change", renderMenu);
$("#reset-filters").addEventListener("click", () => {
  $("#search").value = "";
  $("#vegetarian").checked = false;
  $('[data-category="all"]').click();
});
$("#language").addEventListener("click", () => {
  bengali = !bengali;
  $("#language").innerHTML = bengali
    ? "বাংলা <span>/ EN</span>"
    : "EN <span>/ বাংলা</span>";
  $("#language").setAttribute(
    "aria-label",
    bengali ? "Show menu in English" : "Show menu in Bengali",
  );
  $("#search").placeholder = bengali
    ? "আপনার প্রিয় খাবার খুঁজুন…"
    : "Find a little delicious…";
  renderCategoryLabels();
  renderMenu();
  notify(bengali ? "মেনু এখন বাংলায়" : "Menu is now in English");
});
$("#preview-order").addEventListener("click", () => {
  const dishes = menu.filter((dish) => cart[dish.id]);
  if (!dishes.length) return;
  const total = dishes.reduce(
    (sum, dish) => sum + dish.price * cart[dish.id],
    0,
  );
  const notes = $("#order-notes").value.trim();
  const text = `SMART DIGITAL MENU — DEMO ONLY\nMATI · Bengali Kitchen\nThis is a sample order, not a confirmed booking.\n\n${dishes.map((dish) => `${cart[dish.id]} × ${dish.name} — ৳${dish.price * cart[dish.id]}`).join("\n")}\n\nSubtotal: ৳${total} (VAT included)\nDelivery charge and availability to be confirmed.${notes ? "\n\nSpecial requests: " + notes : ""}\n\nPlease confirm allergens and availability before any real order.`;
  $("#message-preview").textContent = text;
  $("#whatsapp-link").href =
    `https://wa.me/${RESTAURANT_WHATSAPP ? RESTAURANT_WHATSAPP : ""}?text=${encodeURIComponent(text)}`;
  $("#order-preview").hidden = false;
  $("#whatsapp-link").focus();
});
$("#order-notes").addEventListener("input", () => {
  $("#order-preview").hidden = true;
});
$(".mobile-toggle").addEventListener("click", () => {
  const expanded = $(".mobile-toggle").getAttribute("aria-expanded") === "true";
  $(".mobile-toggle").setAttribute("aria-expanded", String(!expanded));
  $(".mobile-toggle").setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation",
  );
  $("#mobile-nav").hidden = expanded;
});
function closeMobileNav() {
  $("#mobile-nav").hidden = true;
  $(".mobile-toggle").setAttribute("aria-expanded", "false");
  $(".mobile-toggle").setAttribute("aria-label", "Open navigation");
}
document
  .querySelectorAll("#mobile-nav a")
  .forEach((link) => link.addEventListener("click", closeMobileNav));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#mobile-nav").hidden) {
    closeMobileNav();
    $(".mobile-toggle").focus();
  }
});
matchMedia("(min-width:701px)").addEventListener("change", (event) => {
  if (event.matches) closeMobileNav();
});
$("#demo-info").addEventListener("click", () => openDialog($("#info-dialog")));
$("#demo-menu-link").addEventListener("click", () =>
  closeDialog($("#info-dialog")),
);
$("#year").textContent = new Date().getFullYear();
renderCategoryLabels();
renderMenu();
saveCart();
