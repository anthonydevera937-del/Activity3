function calculateItemAmount(price, quantity) {
    return price * quantity;
}

function calculateDiscount(subtotal) {
    let discount = 0;
    if (subtotal >= 5000) {
        discount = subtotal * 0.10;
    } else if (subtotal >= 3000) {
        discount = subtotal * 0.07;
    } else if (subtotal >= 1000) {
        discount = subtotal * 0.05;
    } else {
        discount = 0;
    }
    return discount;
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

const productCountInput = document.getElementById('productCount');
const productsContainer = document.getElementById('productsContainer');
const calculateBtn = document.getElementById('calculateBtn');
const validationMessage = document.getElementById('validationMessage');
const customerNameInput = document.getElementById('customerName');
const deliveryOptionSelect = document.getElementById('deliveryOption');
const orderSummaryDiv = document.getElementById('orderSummary');

productCountInput.addEventListener('input', function() {
    const count = parseInt(productCountInput.value);
    productsContainer.innerHTML = '';
    
    if (isNaN(count) || count <= 0) return;

    for (let i = 0; i < count; i++) {
        const productDiv = document.createElement('div');
        productDiv.style.marginBottom = '10px';
        productDiv.innerHTML = `
            <strong>Product ${i + 1}</strong><br>
            <label>Product Name</label><br>
            <input type="text" id="productName-${i}"><br>
            <label>Price</label><br>
            <input type="number" id="productPrice-${i}"><br>
            <label>Quantity</label><br>
            <input type="number" id="productQuantity-${i}"><br>
        `;
        productsContainer.appendChild(productDiv);
    }
});

calculateBtn.addEventListener('click', function() {
    validationMessage.textContent = '';
    orderSummaryDiv.textContent = '';

    const customerName = customerNameInput.value.trim();
    const count = parseInt(productCountInput.value);

    if (customerName === '') {
        validationMessage.textContent = 'Customer name cannot be empty.';
        return;
    }

    if (isNaN(count) || count <= 0) {
        validationMessage.textContent = 'Please enter a valid number of products.';
        return;
    }

    let subtotal = 0;
    let productDetails = '';

    for (let i = 0; i < count; i++) {
        const nameEl = document.getElementById(`productName-${i}`);
        const priceEl = document.getElementById(`productPrice-${i}`);
        const qtyEl = document.getElementById(`productQuantity-${i}`);

        if (!nameEl || !priceEl || !qtyEl) {
            validationMessage.textContent = 'Please fill up all product fields properly.';
            return;
        }

        const name = nameEl.value.trim();
        const price = parseFloat(priceEl.value);
        const quantity = parseInt(qtyEl.value);

        if (name === '' || isNaN(price) || price < 0 || isNaN(quantity) || quantity <= 0) {
            validationMessage.textContent = `Please enter valid values for Product ${i + 1}.`;
            return;
        }

        const amount = calculateItemAmount(price, quantity);
        subtotal += amount;

        productDetails += `${i + 1}. ${name}\n   Price: ₱${price.toFixed(2)}\n   Quantity: ${quantity}\n   Amount: ₱${amount.toFixed(2)}\n`;
    }

    const discountAmount = calculateDiscount(subtotal);
    
    let discountRateStr = 'No discount';
    if (subtotal >= 5000) discountRateStr = '10%';
    else if (subtotal >= 3000) discountRateStr = '7%';
    else if (subtotal >= 1000) discountRateStr = '5%';

    const optionVal = deliveryOptionSelect.value;
    const deliveryFee = getDeliveryFee(optionVal);

    let deliveryTypeName = 'Store Pickup';
    if (optionVal === '2') deliveryTypeName = 'Standard Delivery';
    else if (optionVal === '3') deliveryTypeName = 'Express Delivery';

    const finalAmount = subtotal - discountAmount + deliveryFee;

    const summaryText = `MINI STORE CHECKOUT SYSTEM
Customer: ${customerName}
${productDetails}
ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRateStr}
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryTypeName}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;

    orderSummaryDiv.textContent = summaryText;
});