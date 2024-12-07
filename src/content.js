function createButton(text, backgroundColor, top) {
  let button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.top = top;
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.innerText = text;
  button.style.background = backgroundColor;
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.padding = '10px 20px';
  button.style.cursor = 'pointer';
  return button;
}

// Create and append the Filter Wishlist button
let filterButton = createButton('Filter Wishlist', '#FF9900', '177px');
filterButton.onclick = filterItems;
document.body.appendChild(filterButton);

// Create and append the Sort by Discount button
let sortButton = createButton('Sort by Discount', '#FF9900', '225px');
sortButton.onclick = sortItemsByDiscount;
document.body.appendChild(sortButton);

console.log("extension loaded");

function filterItems() {
  let f = () => {
      let r = false;
      // Use a more general selector to find items:
      let items = document.querySelectorAll('li.g-item-sortable');
      for (let i of items) {
          // Try to find indications of a deal
          let priceDropElement = i.querySelector('.itemPriceDrop');
          let priceElement = i.querySelector('span.a-offscreen');
          let badgeElement = i.querySelector('.wl-deal-rich-badge-label');

          // Extract price if available
          let v = 0;
          if (priceElement) {
              let rawPrice = priceElement.innerText || priceElement.textContent;
              if (rawPrice) {
                  v = parseFloat(rawPrice.replace(/[^\d.]/g, '')) || 0;
              }
          }

          // Logic to filter out items that have no deal (no badge, no price drop)
          // and have a price greater than a certain threshold if needed
          if (!badgeElement && (!priceDropElement || v > 999999)) { 
              i.parentElement.removeChild(i);
              r = true;
          }
      }
      if (r) f(); // Re-run if any changes were made
  };
  f();
}

function sortItemsByDiscount() {
  const itemsContainer = document.getElementById('g-items');
  if (!itemsContainer) {
      console.warn('Items container not found');
      return;
  }

  let itemsArray = Array.from(itemsContainer.querySelectorAll('li.g-item-sortable'));

  // Debugging: Log the unsorted discounts
  console.log('Unsorted Discounts:');
  itemsArray.forEach(item => {
      let discount = extractDiscountPercentage(item);
      console.log(`${item.getAttribute('data-itemid')}: ${discount}%`);
  });

  // Sort in descending order by discount
  itemsArray.sort((a, b) => {
      let discountA = extractDiscountPercentage(a);
      let discountB = extractDiscountPercentage(b);
      return discountB - discountA; 
  });

  // Debugging: Log the sorted discounts
  console.log('Sorted Discounts:');
  itemsArray.forEach(item => {
      let discount = extractDiscountPercentage(item);
      console.log(`${item.getAttribute('data-itemid')}: ${discount}%`);
  });

  // Re-append items to apply new order
  itemsArray.forEach(item => itemsContainer.appendChild(item));
}

function extractDiscountPercentage(item) {
  let discountPercentage = 0;

  // Attempt old selectors first
  let discountElement = item.querySelector('.itemPriceDrop span');
  if (discountElement) {
      const discountText = discountElement.innerText;
      let match = discountText.match(/(\d+)\s*%/);
      if (match && match[1]) discountPercentage = parseInt(match[1], 10);
  }

  // Attempt known deal badge selectors if no discount found
  if (discountPercentage === 0) {
      let badgeElement = item.querySelector('.wl-deal-rich-badge-label span:nth-child(2)');
      if (badgeElement) {
          const discountText = badgeElement.innerText;
          let match = discountText.match(/(\d+)%/);
          if (match && match[1]) discountPercentage = parseInt(match[1], 10);
      }
  }

  // If still no discount found, try a more generic approach:
  if (discountPercentage === 0) {
      // Look for any text node in the item that might indicate a discount
      let itemText = item.innerText || '';
      let matches = itemText.match(/(\d+)%\s*desc/i);
      if (matches && matches[1]) {
          discountPercentage = parseInt(matches[1], 10);
      }
  }

  return discountPercentage;
}
