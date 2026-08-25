// =======================================================
// MINI STORE CHECKOUT SYSTEM
// =======================================================

// ---------- Required top-level calculation functions ----------
// These must ONLY return values. No DOM access, no alert(), no prompt().

function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  let discountRate = 0;

  if (subtotal >= 5000) {
    discountRate = 0.10;
  } else if (subtotal >= 3000) {
    discountRate = 0.07;
  } else if (subtotal >= 1000) {
    discountRate = 0.05;
  } else {
    discountRate = 0;
  }

  return subtotal * discountRate;
}

function getDeliveryFee(option) {
  let fee = 0;

  switch (Number(option)) {
    case 1:
      fee = 0;
      break;
    case 2:
      fee = 80;
      break;
    case 3:
      fee = 150;
      break;
    default:
      fee = 0;
  }

  return fee;
}

// ---------- Helper: currency formatting ----------

function formatCurrency(amount) {
  return "\u20B1" + amount.toFixed(2);
}

// ---------- Generate dynamic product input fields ----------

const productCountField = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

function generateProductFields() {
  productsContainer.innerHTML = "";

  const productCount = parseInt(productCountField.value, 10);

  if (isNaN(productCount) || productCount <= 0) {
    return false;
  }

  // Required: use a for loop to dynamically create product fields
  for (let i = 0; i < productCount; i++) {
    const block = document.createElement("div");
    block.className = "product-block";

    block.innerHTML = `
      <label for="productName-${i}">Product Name</label>
      <input type="text" id="productName-${i}" placeholder="Product name" />

      <label for="productPrice-${i}">Price</label>
      <input type="number" id="productPrice-${i}" placeholder="Price" step="0.01" />

      <label for="productQuantity-${i}">Quantity</label>
      <input type="number" id="productQuantity-${i}" placeholder="Quantity" step="1" />
    `;

    productsContainer.appendChild(block);
  }

  return true;
}

// Fields regenerate automatically as soon as productCount changes,
// so no extra button click is needed before Calculate Order.
productCountField.addEventListener("input", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";
  generateProductFields();
});
productCountField.addEventListener("change", generateProductFields);

// ---------- Calculate Order ----------

const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const customerName = document.getElementById("customerName").value.trim();
  const productCount = parseInt(productCountField.value, 10);

  let errors = [];

  // Validate customer name
  if (customerName === "") {
    errors.push("Customer name cannot be empty.");
  }

  // Validate product count
  if (isNaN(productCount) || productCount <= 0) {
    errors.push("Number of products must be a valid positive number.");
    validationMessage.textContent = errors.join("\n");
    return;
  }

  // Fallback: if fields for this count weren't generated yet
  // (e.g. productCount was set without firing an input/change event),
  // generate them now so calculation can still proceed.
  if (!document.getElementById(`productName-${productCount - 1}`)) {
    generateProductFields();
    validationMessage.textContent =
      "Product fields have been generated. Please fill them in and click Calculate Order again.";
    return;
  }

  let subtotal = 0; // accumulator
  let productDetails = "";

  // Required: use a for loop to process each product
  for (let i = 0; i < productCount; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const quantityField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !quantityField) {
      errors.push(`Product ${i + 1} fields were not generated. Click "Generate Product Fields" first.`);
      continue;
    }

    const productName = nameField.value.trim();
    const price = parseFloat(priceField.value);
    const quantity = parseFloat(quantityField.value);

    if (productName === "") {
      errors.push(`Product ${i + 1}: name cannot be empty.`);
    }
    if (isNaN(price) || price <= 0) {
      errors.push(`Product ${i + 1}: price must be a valid positive number.`);
    }
    if (isNaN(quantity) || quantity <= 0) {
      errors.push(`Product ${i + 1}: quantity must be a valid positive number.`);
    }

    if (productName !== "" && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
      const itemAmount = calculateItemAmount(price, quantity);
      subtotal += itemAmount; // accumulate

      productDetails += `${i + 1}. ${productName}\n`;
      productDetails += `   Price: ${formatCurrency(price)}\n`;
      productDetails += `   Quantity: ${quantity}\n`;
      productDetails += `   Amount: ${formatCurrency(itemAmount)}\n\n`;
    }
  }

  if (errors.length > 0) {
    validationMessage.textContent = errors.join("\n");
    return;
  }

  // Determine discount
  const discountAmount = calculateDiscount(subtotal);
  const discountRate = subtotal >= 5000 ? 10 :
                        subtotal >= 3000 ? 7 :
                        subtotal >= 1000 ? 5 : 0;

  // Determine delivery fee
  const deliveryOption = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOption);

  let deliveryType = "";
  switch (Number(deliveryOption)) {
    case 1:
      deliveryType = "Store Pickup";
      break;
    case 2:
      deliveryType = "Standard Delivery";
      break;
    case 3:
      deliveryType = "Express Delivery";
      break;
    default:
      deliveryType = "Unknown";
  }

  // Final amount
  const finalAmount = subtotal - discountAmount + deliveryFee;

  // Build and display order summary
  let summary = "MINI STORE CHECKOUT SYSTEM\n\n";
  summary += `Customer: ${customerName}\n\n`;
  summary += productDetails;
  summary += "ORDER SUMMARY\n";
  summary += `Subtotal: ${formatCurrency(subtotal)}\n`;
  summary += `Discount Rate: ${discountRate}%\n`;
  summary += `Discount Amount: ${formatCurrency(discountAmount)}\n`;
  summary += `Delivery Type: ${deliveryType}\n`;
  summary += `Delivery Fee: ${formatCurrency(deliveryFee)}\n`;
  summary += `Final Amount: ${formatCurrency(finalAmount)}`;

  orderSummary.textContent = summary;
});