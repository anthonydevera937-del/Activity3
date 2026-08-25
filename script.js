function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  let discountRate = 0;
  if (subtotal >= 5000) {
    discountRate = 0.1;
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

function getDiscountRate(subtotal) {
  if (subtotal >= 5000) return 0.1;
  if (subtotal >= 3000) return 0.07;
  if (subtotal >= 1000) return 0.05;
  return 0;
}

function getDeliveryLabel(option) {
  switch (Number(option)) {
    case 1:
      return "Store Pickup";
    case 2:
      return "Standard Delivery";
    case 3:
      return "Express Delivery";
    default:
      return "Unknown";
  }
}

function formatCurrency(amount) {
  return (
    "₱" +
    Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateItemAmount,
    calculateDiscount,
    getDeliveryFee,
    getDiscountRate,
    getDeliveryLabel,
    formatCurrency,
  };
}

function initApp() {
  const customerNameInput = document.getElementById("customerName");
  const productCountInput = document.getElementById("productCount");
  const productsContainer = document.getElementById("productsContainer");
  const deliveryOptionSelect = document.getElementById("deliveryOption");
  const calculateBtn = document.getElementById("calculateBtn");
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  if (
    !customerNameInput ||
    !productCountInput ||
    !productsContainer ||
    !deliveryOptionSelect ||
    !calculateBtn ||
    !validationMessage ||
    !orderSummary
  ) {
    return;
  }

  function generateProductFields() {
    const count = parseInt(productCountInput.value, 10);
    productsContainer.innerHTML = "";
    validationMessage.textContent = "";
    orderSummary.textContent = "";

    if (isNaN(count) || count <= 0) return;

    let fieldsHTML = "";
    for (let i = 0; i < count; i++) {
      fieldsHTML += `
        <div class="product-block">
          <h3>Product ${i + 1}</h3>
          <label for="productName-${i}">Product Name</label>
          <input type="text" id="productName-${i}" placeholder="Enter product name">
          <label for="productPrice-${i}">Price</label>
          <input type="number" id="productPrice-${i}" min="0" step="0.01" placeholder="Enter price">
          <label for="productQuantity-${i}">Quantity</label>
          <input type="number" id="productQuantity-${i}" min="1" step="1" placeholder="Enter quantity">
        </div>
      `;
    }
    productsContainer.innerHTML = fieldsHTML;
  }

  productCountInput.addEventListener("change", generateProductFields);
  productCountInput.addEventListener("input", generateProductFields);

  function validateInputs(count) {
    const errors = [];
    const name = customerNameInput.value.trim();
    if (name === "") errors.push("Customer name must not be empty.");

    if (isNaN(count) || count <= 0) {
      errors.push("Number of products must be a valid positive number.");
      return { isValid: errors.length === 0, errors };
    }

    for (let i = 0; i < count; i++) {
      const nameField = document.getElementById(`productName-${i}`);
      const priceField = document.getElementById(`productPrice-${i}`);
      const quantityField = document.getElementById(`productQuantity-${i}`);

      if (!nameField || !priceField || !quantityField) {
        errors.push(
          `Product ${i + 1}: input fields were not found. Please regenerate the product list.`,
        );
        continue;
      }

      const productName = nameField.value.trim();
      const price = parseFloat(priceField.value);
      const quantity = parseFloat(quantityField.value);

      if (productName === "")
        errors.push(`Product ${i + 1}: product name must not be empty.`);
      if (isNaN(price) || price <= 0)
        errors.push(`Product ${i + 1}: price must be a valid positive number.`);
      if (isNaN(quantity) || quantity <= 0)
        errors.push(
          `Product ${i + 1}: quantity must be a valid positive number.`,
        );
    }

    return { isValid: errors.length === 0, errors };
  }

  calculateBtn.addEventListener("click", function () {
    const count = parseInt(productCountInput.value, 10);
    const validation = validateInputs(count);

    if (!validation.isValid) {
      validationMessage.innerHTML = `<span class="error">Please fix the following:\n- ${validation.errors.join("\n- ")}</span>`;
      orderSummary.textContent = "";
      return;
    }

    validationMessage.innerHTML = `<span class="success">All inputs are valid.</span>`;

    const customerName = customerNameInput.value.trim();
    let subtotal = 0;
    let productDetailsText = "";

    for (let i = 0; i < count; i++) {
      const productName = document
        .getElementById(`productName-${i}`)
        .value.trim();
      const price = parseFloat(
        document.getElementById(`productPrice-${i}`).value,
      );
      const quantity = parseFloat(
        document.getElementById(`productQuantity-${i}`).value,
      );

      const itemAmount = calculateItemAmount(price, quantity);
      subtotal += itemAmount;

      productDetailsText += `
${i + 1}. ${productName}
   Price: ${formatCurrency(price)}
   Quantity: ${quantity}
   Amount: ${formatCurrency(itemAmount)}
`;
    }

    const discountAmount = calculateDiscount(subtotal);
    const discountRate = getDiscountRate(subtotal);
    const deliveryOptionValue = deliveryOptionSelect.value;
    const deliveryFee = getDeliveryFee(deliveryOptionValue);
    const deliveryLabel = getDeliveryLabel(deliveryOptionValue);
    const finalAmount = subtotal - discountAmount + deliveryFee;

    orderSummary.textContent = `MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}
${productDetailsText}
ORDER SUMMARY
Subtotal: ${formatCurrency(subtotal)}
Discount Rate: ${(discountRate * 100).toFixed(0)}%
Discount Amount: ${formatCurrency(discountAmount)}
Delivery Type: ${deliveryLabel}
Delivery Fee: ${formatCurrency(deliveryFee)}
Final Amount: ${formatCurrency(finalAmount)}`;
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
