// --- Layer switching logic ---
const layer1 = document.querySelector(".layer1");
const layer2 = document.querySelector(".layer3");
const layer3 = document.querySelector(".layer2");

const layers = [layer1, layer2, layer3];
let currentLayer = 0;
let isScrolling = false;
 /**
   * updateLayers
   * Eng: Updates layer opacity to show only the current one.
   * עברית: מעדכן את השכבות כך שרק השכבה הנוכחית תוצג (שקיפות 1).
   */
if (layer1 && layer2 && layer3) {
  function updateLayers() {
    layers.forEach((layer, index) => {
      layer.style.opacity = index === currentLayer ? "1" : "0";
    });
  }
  updateLayers();

  window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    isScrolling = true;
    if (e.deltaY > 0) {
      currentLayer = Math.min(currentLayer + 1, layers.length - 1);
    } else {
      currentLayer = Math.max(currentLayer - 1, 0);
    }
    updateLayers();
    setTimeout(() => {
      isScrolling = false;
    }, 400);
  });
}

// --- Auto grow textarea ---
const textarea = document.querySelector('.auto-textarea');
if (textarea) {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
}

// --- Road lines animation ---
const counters = document.querySelectorAll('.index-counter');
const counterSection = document.getElementById('index-counter-section');

if (counters.length > 0 && counterSection) {
  let started = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      counter.innerText = '0';
      const update = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = target / 100;

        if (current < target) {
          counter.innerText = Math.ceil(current + increment);
          setTimeout(update, 20);
        } else {
          counter.innerText = target;
        }
      };
      update();
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        animateCounters();
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(counterSection);
}
//פונקציה להוזזת הכביש בדף אירועים
/**
 * createRoadLines
 * Eng: Creates animated road lines inside a container.
 * עברית: יוצרת קווים מונפשים (כמו כביש) בתוך אלמנט לפי מזהה.
 */
function createRoadLines(containerId, numLines , spacing  ,animationDuration ) {
  const container = document.getElementById(containerId);
  if (!container) return; 
  for (let i = 0; i < numLines; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    const delay = (i * spacing) / 200; 
    line.style.setProperty('--delay', `-${delay}s`);
    line.style.setProperty('--duration', `${animationDuration}s`);
    container.appendChild(line);
  }
}
createRoadLines("road", 25, 300, 30);
createRoadLines("road-top", 25, 300, 30);
// --- Data definitions ---



const data = {
  adds: ['קרוקנט', 'עוגיות אוראו', 'מקופלת לבנה', 'מקופלת חומה', 'סוכריות', 'שברי וופל', 'עדשים', 'בוטנים', 'שברי גליליות', 'פצפוצי שוקולד'],
  fruits: ['פסיפלורה', 'מלון', 'מנגו', 'תמר', 'בננה', 'תות', 'אננס', 'קיווי', 'פירות יער', 'אוכמניות'],
  glazes: ['שוקולד חום', 'שוקולד לבן', 'סירופ מייפל', 'סירופ שוקולד', 'ריבת חלב','קרם נוגט','קרמל'],
  basic: ['יוגורט', 'חלב', 'מים', 'מיץ תפוזים', 'מיץ תפוחים'],
  icecream: ['חדש!תות בשמנת', 'שוקולד', 'וניל', 'אגוזים', 'פסטוק', 'מסטיק', 'פונץ בננה', 'דובדבן', 'רום צימוקים', 'מוקה', 'בננה פליק', 'וניל מקופלת', 'וניל פצפוצים', 'קרם קוקיז/עוגיות', 'ריבת חלב', 'שוקולד לבן', 'פקאן', 'מרשמלו כחול', 'סורבה תות', 'סורבה משמש', 'סורבה לימון', 'סורבה פסיפלורה', 'סורבה מנגו', 'ויסקי']
};

const prices = {
  'פרוזן יוגורט': 50,
  'קרפ צרפתי': 60,
  'וופל בלגי': 80,
  'גלידה טבעונית': 90,
  'גלידה חלבית': 120,
  'מילקשייק': 70,
  'פרישייק': 45
};

const limits = {
  fruits: -1,   // אין הגבלה
  adds: 3,
  glazes: 2,
  basic: 1,
  icecream: 6
};

let selections = {
  fruits: 0,
  adds: 0,
  glazes: 0,
  basic: 0,
  icecream: 0
};

const contentArea = document.getElementById('menu_panel_buttons');
/**
 * createButtons
 * Eng: Creates selection buttons for a specific category.
 * עברית: יוצר כפתורים לבחירה עבור קטגוריה מסוימת.
 */
function createButtons(arr, category) {
  return arr.map(text => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add('topping-button');
    btn.dataset.category = category;

    btn.addEventListener('click', () => {
      const isSelected = btn.classList.contains('selected');
      const currentLimit = limits[category];
      const currentCount = selections[category];

      if (isSelected) {
        btn.classList.remove('selected');
        selections[category]--;
        updateCategoryTitle(category);
      } else {
        if (currentLimit === -1 || currentCount < currentLimit) {
          btn.classList.add('selected');
          selections[category]++;
          updateCategoryTitle(category);
        } else {
          let message = '';
          switch (category) {
            case 'adds': message = `ניתן לבחור עד ${currentLimit} תוספות בלבד.`; break;
            case 'glazes': message = `ניתן לבחור עד ${currentLimit} זיגוגים בלבד.`; break;
            case 'basic': message = `ניתן לבחור רק ${currentLimit} בסיס.`; break;
            case 'icecream': message = `ניתן לבחור עד ${currentLimit} טעמי גלידה בלבד.`; break;
            default: message = `הגעת למגבלת הבחירה עבור קטגוריה זו.`; break;
          }
          alert(message);
        }
      }
    });

    return btn;
  });
}
/**
 * updateCategoryTitle
 * Eng: Updates the title of a category with current selection count.
 * עברית: מעדכן את כותרת הקטגוריה לפי מספר הבחירות הנוכחי.
 */
function updateCategoryTitle(category) {
  const titleElement = document.querySelector(`[data-category-title="${category}"]`);
  if (titleElement) {
    const currentCount = selections[category];
    const limit = limits[category];
    const baseTitleText = titleElement.dataset.baseTitle;

    if (limit === -1) {
      titleElement.textContent = `${baseTitleText} (נבחרו: ${currentCount})`;
    } else {
      titleElement.textContent = `${baseTitleText} (${currentCount}/${limit})`;
    }
  }
}

/**
 * createCategoryTitle
 * Eng: Generates a styled title element for a category.
 * עברית: יוצר כותרת מעוצבת לקטגוריה.
 */
function createCategoryTitle(titleText, category) {
  const title = document.createElement('h3');
  title.dataset.categoryTitle = category;
  title.dataset.baseTitle = titleText;

  const limit = limits[category];
  if (limit === -1) {
    title.textContent = `${titleText} (נבחרו: 0)`;
  } else {
    title.textContent = `${titleText} (0/${limit})`;
  }

  title.style.color = '#268c99';
  title.style.fontFamily = 'OS_Luizi';
  title.style.marginTop = '20px';
  title.style.marginBottom = '10px';
  title.style.fontSize = '1.2rem';
  title.style.textAlign = 'right';
  title.style.width = '100%';
  title.style.display = 'block';
  title.style.paddingRight = '10px';

  return title;
}

/**
 * fillSidePanel
 * Eng: Fills the side panel with appropriate categories for a selected item.
 * עברית: ממלא את הפאנל בצד בקטגוריות הרלוונטיות לפי סוג המוצר.
 */
function fillSidePanel(item) {
  if (!contentArea) return;

  contentArea.innerHTML = '';
  Object.keys(selections).forEach(key => { selections[key] = 0; });

  if (item === 'פרוזן יוגורט') {
    fillfruits();
    filladds();
    fillglazes();
  } else if (item === 'קרפ צרפתי' || item === 'וופל בלגי') {
    fillicecream();
    filladds();
    fillglazes();
  } else if (item === 'גלידה טבעונית' || item === 'גלידה חלבית' || item === 'מילקשייק') {
    fillicecream();
  } else if (item === 'פרישייק') {
    fillicecream();
    fillbasic();
  }
}
/**
 * fillfruits / filladds / fillglazes / fillicecream / fillbasic
 * Eng: These fill functions add specific category buttons to the side panel.
 * עברית: כל אחת מהפונקציות מוסיפה כפתורים לקטגוריה מתאימה בפאנל.
 */
function fillfruits() {
  const fruitsTitle = createCategoryTitle('פירות', 'fruits');
  contentArea.appendChild(fruitsTitle);
  const fruitButtons = createButtons(data.fruits, 'fruits');
  fruitButtons.forEach(btn => contentArea.appendChild(btn));
}
function filladds() {
  const addsTitle = createCategoryTitle('תוספות', 'adds');
  contentArea.appendChild(addsTitle);
  const addsButtons = createButtons(data.adds, 'adds');
  addsButtons.forEach(btn => contentArea.appendChild(btn));
}
function fillglazes() {
  const glazesTitle = createCategoryTitle('זיגוגים', 'glazes');
  contentArea.appendChild(glazesTitle);
  const glazesButtons = createButtons(data.glazes, 'glazes');
  glazesButtons.forEach(btn => contentArea.appendChild(btn));
}
function fillicecream() {
  const icecreamTitle = createCategoryTitle('טעמי גלידה לבחירה', 'icecream');
  contentArea.appendChild(icecreamTitle);
  const icecreamButtons = createButtons(data.icecream, 'icecream');
  icecreamButtons.forEach(btn => contentArea.appendChild(btn));
}
function fillbasic() {
  const basicTitle = createCategoryTitle('בסיס לבחירה', 'basic');
  contentArea.appendChild(basicTitle);
  const basicButtons = createButtons(data.basic, 'basic');
  basicButtons.forEach(btn => contentArea.appendChild(btn));
}

// --- הפתיחה והסגירה של הפאנל עם הצגת שם מוצר --- 
let currentProductName = '';
// --- Panel open/close ---
/**
 * openpanel
 * Eng: Opens the product customization panel and loads relevant options.
 * עברית: פותח את הפאנל להתאמה אישית של מוצר ומציג את האפשרויות.
 */
function openpanel(item) {
  currentProductName = item;
  document.getElementById('menu_panel').classList.add('open');

  const titleElement = document.getElementById('panel-product-title');
  if (titleElement) {
    titleElement.textContent = currentProductName;
  }

  fillSidePanel(item);
}
/**
 * closepanel
 * Eng: Closes the product customization panel.
 * עברית: סוגר את הפאנל של התאמת המוצר.
 */
function closepanel() {
  document.getElementById('menu_panel').classList.remove('open');
}

// --- עגלת קניות ---

// --- Cart Logic ---
/**
 * openCart / closeCart
 * Eng: Opens or closes the shopping cart panel.
 * עברית: פותח או סוגר את עגלת הקניות.
 */
function openCart() {
  document.getElementById('cart-panel').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cart-panel').classList.remove('open');
}
/**
 * addToCart
 * Eng: Adds a product with selected options to the cart and saves it.
 * עברית: מוסיף מוצר עם תוספות שנבחרו לעגלה ושומר ב־localStorage.
 */
function addToCart(productName, selectionsObj) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const price = prices[productName] || 0;

  const newItem = {
    product: productName,
    selections: selectionsObj,
    price: price
  };

  cart.push(newItem);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("נוסף לעגלה!");
}
/**
 * renderCartItems
 * Eng: Displays all cart items and total price inside the cart panel.
 * עברית: מציג את פריטי העגלה והמחיר הכולל בפאנל העגלה.
 */
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cart-items');

  if (!cartList) {
    console.error("שגיאה: אלמנט עם id='cart-items' לא נמצא בדף.");
    return;
  }

  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = '<li>העגלה ריקה</li>';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const selectionsText = item.selections && typeof item.selections === 'object'
      ? Object.entries(item.selections)
          .filter(([cat, items]) => Array.isArray(items) && items.length > 0)
          .map(([cat, items]) => `<strong>${cat}</strong>: ${items.join(', ')}`)
          .join('<br>')
      : 'אין תוספות נבחרות';

    const itemPrice = item.price || 0;
    total += itemPrice;

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.product || 'מוצר ללא שם'}</strong> - ${itemPrice} ₪<br>
      ${selectionsText}
      <br><button onclick="removeFromCart(${index})" class="remove-btn">הסר</button>
      <hr>
    `;

    cartList.appendChild(li);
  });

  const totalLi = document.createElement('li');
  totalLi.innerHTML = `<strong>סה"כ לתשלום: ${total} ₪</strong>`;
  cartList.appendChild(totalLi);
}
/**
 * removeFromCart
 * Eng: Removes an item from the cart by index.
 * עברית: מסיר פריט מהעגלה לפי האינדקס שלו.
 */
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
}
/**
 * handleAddToCart
 * Eng: Collects selected options and adds them as a product to the cart.
 * עברית: אוסף את הכפתורים שנבחרו ומוסיף אותם לעגלה כמוצר.
 */
function handleAddToCart(productName) {
  const selectedButtons = document.querySelectorAll('.topping-button.selected');
  const selectionsToSave = {
    fruits: [],
    adds: [],
    glazes: [],
    basic: [],
    icecream: []
  };

  selectedButtons.forEach(btn => {
    const cat = btn.dataset.category;
    selectionsToSave[cat].push(btn.textContent);
  });

  addToCart(productName, selectionsToSave);
  closepanel();
  renderCartItems();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
});


// --- Form Validation ---
/**
 * isFormValid
 * Eng: Checks if all required fields are filled.
 * עברית: בודק אם כל השדות הנדרשים מולאו.
 */
function isFormValid() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  return firstName !== "" && lastName !== "" && email !== "" && phone !== "";
}
/**
 * showSuccessMessage
 * Eng: Displays a success alert after form submission.
 * עברית: מציג הודעת הצלחה לאחר שליחת הטופס.
 */
function showSuccessMessage() {
  alert("הפרטים נשלחו בהצלחה!");
}
/**
 * handleSubmit
 * Eng: Handles form submission and validates inputs.
 * עברית: מטפל בשליחת הטופס ובודק את התקינות של השדות.
 */
function handleSubmit(event) {
  event.preventDefault(); 
  if (isFormValid()) {
    showSuccessMessage();
  } else {
    alert("אנא מלאי את כל השדות החובה.");
  }
}






// טעינת העגלה מהאחסון המקומי
let cart = JSON.parse(localStorage.getItem("cart")) || [];
/**
 * updateCheckoutPanel
 * Eng: Updates the checkout panel with cart items and totals.
 * עברית: מעדכן את פאנל התשלום עם פריטי העגלה והמחיר הכולל.
 */
// פונקציה להצגת פרטי ההזמנה בפאנל התשלום
function updateCheckoutPanel(cart) {
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");

  if (!checkoutItemsContainer || !checkoutTotal) return;

  checkoutItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const extras = item.selections
      ? Object.values(item.selections).flat().join(", ")
      : "";

    const itemDiv = document.createElement("div");
    itemDiv.className = "checkout-item";
    itemDiv.innerHTML = `
      <span>${item.product} ${extras ? `(${extras})` : ""}</span>
      <span>₪${item.price}</span>
    `;
    checkoutItemsContainer.appendChild(itemDiv);
    total += item.price;
  });

  checkoutTotal.innerText = `סך הכול: ₪${total}`;
}

/**
 * submitOrder
 * Eng: Submits the order, clears the cart and hides the checkout panel.
 * עברית: שולח את ההזמנה, מנקה את העגלה וסוגר את פאנל התשלום.
 */

// פונקציה לשליחת ההזמנה
function submitOrder() {
  alert("הזמנה נשלחה בהצלחה!");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay?.(); // אם קיימת הפונקציה הזו
  toggleCheckoutPanel(false);
}

// מאזין לכפתור לתשלום
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-button");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      updateCheckoutPanel(cart);
      toggleCheckoutPanel(true);
    });
  }
});

// סגירת הפאנל בלחיצה על הכפתור
document.getElementById("close-checkout").addEventListener("click", () => {
  toggleCheckoutPanel(false);
  // סגור גם טופס במידת הצורך
  document.getElementById("payment-form").classList.add("hidden");
});

// הצגת טופס הזנת פרטים בלחיצה על הכפתור
document.getElementById("show-payment-form").addEventListener("click", () => {
  const form = document.getElementById("payment-form");
  form.classList.toggle("hidden");
});

// טיפול בהגשת הטופס
document.getElementById("payment-form").addEventListener("submit", function(e) {
  e.preventDefault();

  // בדיקת תקינות פשוטה
  const address = document.getElementById("address").value.trim();
  const card = document.getElementById("credit-card").value.trim();
  const expiry = document.getElementById("expiry-date").value.trim();

  if (!address || !card.match(/^\d{16}$/) || !expiry) {
    alert("אנא מלא את כל השדות בצורה תקינה.");
    return;
  }

  // alert("ההזמנה נשלחה בהצלחה! תודה.");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCheckoutPanel(cart);
  toggleCheckoutPanel(false);
  this.classList.add("hidden");
});

// מאזין לכפתור לתשלום
document.getElementById("pay-button").addEventListener("click", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("העגלה ריקה, אנא הוסף פריטים לעגלה.");
    return;
  }
  updateCheckoutPanel(cart);
  toggleCheckoutPanel(true);
});



// Function to update the payment panel with the order details
// פונקציה לעדכון פאנל התשלום עם פרטי ההזמנה
function updateCheckoutPanel(cart) {
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");

  if (!checkoutItemsContainer || !checkoutTotal) return;

  checkoutItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const extras = item.selections
      ? Object.values(item.selections).flat().join(", ")
      : "";

    const itemDiv = document.createElement("div");
    itemDiv.className = "checkout-item";
    itemDiv.innerHTML = `
      <span>${item.product} ${extras ? `(${extras})` : ""}</span>
      <span>₪${item.price}</span>
    `;
    checkoutItemsContainer.appendChild(itemDiv);
    total += item.price;
  });

  checkoutTotal.innerText = `סך הכול: ₪${total}`;
}
/**
 * toggleCheckoutPanel
 * Eng: Shows or hides the checkout panel.
 * עברית: מציג או מסתיר את פאנל התשלום.
 */
// פונקציה לפתיחת/סגירת פאנל התשלום
function toggleCheckoutPanel(show) {
  const panel = document.getElementById("checkout-panel");
  if (panel) panel.classList.toggle("hidden", !show);
}

// פונקציה לטיפול בשליחת ההזמנה
function submitOrder(event) {
  event.preventDefault();

  const address = document.getElementById("address").value.trim();
  const card = document.getElementById("credit-card").value.trim();
  const expiry = document.getElementById("expiry-date").value.trim();

  // בדיקות בסיסיות
  if (!address || !card.match(/^\d{16}$/) || !expiry) {
    alert("אנא מלא את כל השדות בצורה תקינה.");
    return;
  }

  alert(`ההזמנה נשלחה בהצלחה לכתובת:\n${address}`);

  // איפוס העגלה והפאנל
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCheckoutPanel(cart);
  toggleCheckoutPanel(false);

  // איפוס הטופס
  document.getElementById("payment-form").reset();
}

// מאזין ללחיצת כפתור 'לתשלום' לפתיחת הפאנל והצגת הפריטים
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-button");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      updateCheckoutPanel(cart);
      toggleCheckoutPanel(true);
    });
  }

  // מאזין לטופס התשלום
  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", submitOrder);
  }
});

  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("#nav1 ul");

    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  });
