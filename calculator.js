/**
 * Merlimorris Printing Shop - Dynamic Pricing Calculator & WhatsApp Quote Engine
 * Business Phone & WhatsApp: +94 71 988 7110
 * Location: Unnappilavu, Mullaitivu
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '94719887110';
  const SHOP_EMAIL = 'merlimorris69@gmail.com';

  // Base pricing models in Sri Lankan Rupees (LKR)
  const PRICING_DATA = {
    'business-cards': {
      name: 'Business Cards',
      baseUnitCost: 4.5, // per card base
      quantities: [100, 250, 500, 1000, 2500, 5000],
      finishes: {
        'standard-matte': { name: 'Standard 350gsm Matte', multiplier: 1.0, minTotal: 1200 },
        'soft-touch': { name: 'Velvet Soft-Touch Lamination', multiplier: 1.35, minTotal: 1800 },
        'gold-foil': { name: 'Luxury Metallic Gold Foil', multiplier: 1.8, minTotal: 2800 },
        'gloss-spot-uv': { name: 'Raised Spot UV + Matte', multiplier: 1.5, minTotal: 2200 },
        'plastic-pvc': { name: 'Waterproof Plastic PVC (Credit Card Style)', multiplier: 2.2, minTotal: 3500 },
        'kraft-eco': { name: 'Eco-Friendly Kraft Cardstock', multiplier: 1.2, minTotal: 1500 }
      },
      sizes: {
        'standard': 'Standard (3.5" x 2" / 89 x 51mm)',
        'square': 'Square (2.5" x 2.5" / 65 x 65mm)',
        'custom-diecut': 'Custom Die-Cut Shaped'
      }
    },
    'flyers': {
      name: 'Flyers & Brochures',
      baseUnitCost: 8.0,
      quantities: [100, 250, 500, 1000, 2500, 5000],
      finishes: {
        'gloss-150': { name: '150gsm Gloss Art Paper', multiplier: 1.0, minTotal: 1500 },
        'matte-170': { name: '170gsm Silk Matte Paper', multiplier: 1.25, minTotal: 1900 },
        'heavy-300': { name: '300gsm Premium Card', multiplier: 1.6, minTotal: 2500 },
        'tri-fold': { name: '150gsm Tri-Fold Brochure', multiplier: 1.45, minTotal: 2400 },
        'bi-fold': { name: '170gsm Half-Fold Brochure', multiplier: 1.35, minTotal: 2200 }
      },
      sizes: {
        'a6': 'A6 (105 x 148 mm)',
        'a5': 'A5 (148 x 210 mm) - Most Popular',
        'a4': 'A4 (210 x 297 mm)',
        'dl': 'DL Envelope Size (99 x 210 mm)'
      }
    },
    'banners': {
      name: 'Vinyl Banners & Roll-Ups',
      baseUnitCost: 280, // per sq ft / unit
      quantities: [1, 2, 3, 5, 10, 20],
      finishes: {
        'vinyl-heavy': { name: '510gsm Heavy-Duty PVC Vinyl (Eyelets included)', multiplier: 1.0, minTotal: 1800 },
        'mesh-wind': { name: 'Mesh Banner (Wind Resistant)', multiplier: 1.3, minTotal: 2400 },
        'rollup-deluxe': { name: 'Pull-Up Roll-Up Standee with Aluminum Base', multiplier: 2.2, minTotal: 4800 },
        'x-banner': { name: 'X-Banner Lightweight Stand', multiplier: 1.6, minTotal: 3200 },
        'backlit-vinyl': { name: 'Backlit Translucent Vinyl (Lightboxes)', multiplier: 1.5, minTotal: 2600 }
      },
      sizes: {
        '2x3': '2ft x 3ft (Small Event)',
        '3x6': '3ft x 6ft (Street Banner)',
        '4x8': '4ft x 8ft (Outdoor Billboard/Shopfront)',
        '5x10': '5ft x 10ft (Grand Opening)',
        'rollup-std': 'Roll-up Standee (2.5ft x 6.5ft / 85x200cm)'
      }
    },
    'stickers': {
      name: 'Stickers & Labels',
      baseUnitCost: 12.0,
      quantities: [50, 100, 250, 500, 1000, 2500],
      finishes: {
        'vinyl-diecut': { name: 'Waterproof Die-Cut Vinyl (Gloss/Matte)', multiplier: 1.0, minTotal: 1200 },
        'clear-trans': { name: 'Ultra-Clear Transparent Vinyl', multiplier: 1.3, minTotal: 1600 },
        'holographic': { name: 'Rainbow Holographic Foil', multiplier: 1.8, minTotal: 2400 },
        'paper-labels': { name: 'Product Label Sheets (Easy Peel)', multiplier: 0.8, minTotal: 950 },
        'gold-metallic-sticker': { name: 'Metallic Gold / Chrome Finish', multiplier: 1.6, minTotal: 2200 }
      },
      sizes: {
        '2inch': '2" x 2" (50 x 50mm)',
        '3inch': '3" x 3" (75 x 75mm)',
        '4inch': '4" x 4" (100 x 100mm)',
        'custom': 'Custom Die-Cut Contour Shape'
      }
    },
    'signage': {
      name: 'Shop Signage & Rigid Boards',
      baseUnitCost: 1200,
      quantities: [1, 2, 3, 5, 10],
      finishes: {
        'acrylic-3d': { name: '3D Laser-Cut Acrylic Lettering', multiplier: 2.5, minTotal: 8500 },
        'acp-board': { name: 'ACP Aluminum Composite Panel Sign', multiplier: 1.8, minTotal: 6500 },
        'foam-corflute': { name: '5mm Corflute / Foam Board Sign', multiplier: 1.0, minTotal: 2200 },
        'lightbox-neon': { name: 'LED Backlit Lightbox / Neon Glow', multiplier: 3.2, minTotal: 14000 }
      },
      sizes: {
        'small': '2ft x 3ft (Door / Window Display)',
        'medium': '3ft x 6ft (Storefront Fascia)',
        'large': '4ft x 8ft (Full Commercial Signboard)',
        'custom': 'Custom Bespoke Architecture Dimensions'
      }
    },
    'invitations': {
      name: 'Wedding & Event Invitations',
      baseUnitCost: 65.0,
      quantities: [50, 100, 150, 200, 300, 500],
      finishes: {
        'gold-foil-linen': { name: 'Gold Foil Stamping + Textured Linen Card', multiplier: 1.4, minTotal: 6500 },
        'pearl-embossed': { name: 'Shimmering Pearl Paper + Blind Emboss', multiplier: 1.25, minTotal: 5500 },
        'laser-cut-luxury': { name: 'Intricate Laser-Cut Jacket + Wax Seal', multiplier: 1.9, minTotal: 9000 },
        'acrylic-glass': { name: 'Clear Acrylic UV-Printed Wedding Invite', multiplier: 2.8, minTotal: 14000 },
        'traditional-card': { name: 'Classic Smooth Ivory Card + Envelopes', multiplier: 1.0, minTotal: 4200 }
      },
      sizes: {
        '5x7': '5" x 7" (127 x 178 mm) - Royal Standard',
        'a5': 'A5 Traditional Card (148 x 210 mm)',
        'square': 'Square 6" x 6" (150 x 150 mm)',
        'custom-gatefold': 'Tri-fold Gatefold Boxed Suite'
      }
    }
  };

  const TURNAROUND_FEES = {
    'standard': { name: 'Standard (24 - 48 Hours)', feePercent: 0 },
    'same-day': { name: 'Same-Day Fast Turnaround (6 - 12 Hours)', feePercent: 0.25 },
    'emergency-rush': { name: 'Express Rush (2 - 4 Hours)', feePercent: 0.50 }
  };

  // Helper formatting for Sri Lankan currency
  function formatLKR(amount) {
    return 'Rs. ' + Math.round(amount).toLocaleString('en-US');
  }

  // Calculate price dynamically
  function calculateQuote(categoryKey, finishKey, sizeKey, quantity, turnaroundKey) {
    const category = PRICING_DATA[categoryKey] || PRICING_DATA['business-cards'];
    const finish = category.finishes[finishKey] || Object.values(category.finishes)[0];
    const turnaround = TURNAROUND_FEES[turnaroundKey] || TURNAROUND_FEES['standard'];

    let unitCost = category.baseUnitCost * finish.multiplier;

    // Quantity tiered discount curve
    if (quantity >= 5000) unitCost *= 0.55;
    else if (quantity >= 2500) unitCost *= 0.65;
    else if (quantity >= 1000) unitCost *= 0.75;
    else if (quantity >= 500) unitCost *= 0.85;
    else if (quantity >= 250) unitCost *= 0.92;

    let subtotal = unitCost * quantity;

    // Enforce category minimum setup charge
    if (subtotal < finish.minTotal) {
      subtotal = finish.minTotal;
    }

    // Apply rush fee if applicable
    const rushFee = subtotal * turnaround.feePercent;
    const total = subtotal + rushFee;

    return {
      categoryName: category.name,
      finishName: finish.name,
      sizeName: category.sizes[sizeKey] || sizeKey,
      quantity: quantity,
      turnaroundName: turnaround.name,
      totalLKR: total,
      totalFormatted: formatLKR(total)
    };
  }

  // Populate dynamic select options on change
  function setupQuoteWidget(widgetEl) {
    if (!widgetEl) return;

    const categorySelect = widgetEl.querySelector('[data-calc="category"]');
    const finishSelect = widgetEl.querySelector('[data-calc="finish"]');
    const sizeSelect = widgetEl.querySelector('[data-calc="size"]');
    const quantitySelect = widgetEl.querySelector('[data-calc="quantity"]');
    const turnaroundSelect = widgetEl.querySelector('[data-calc="turnaround"]');
    const priceDisplay = widgetEl.querySelector('[data-calc-display="price"]');
    const summaryProduct = widgetEl.querySelector('[data-calc-display="product"]');
    const summarySpecs = widgetEl.querySelector('[data-calc-display="specs"]');
    const summaryQty = widgetEl.querySelector('[data-calc-display="quantity"]');
    const summaryTurnaround = widgetEl.querySelector('[data-calc-display="turnaround"]');
    const whatsappBtn = widgetEl.querySelector('[data-calc-action="whatsapp"]');
    const formSubmitBtn = widgetEl.querySelector('[data-calc-action="submit"]');

    function updateOptions() {
      const selectedCat = categorySelect ? categorySelect.value : 'business-cards';
      const data = PRICING_DATA[selectedCat];
      if (!data) return;

      // Update Finishes if dropdown exists
      if (finishSelect) {
        const currentFinish = finishSelect.value;
        finishSelect.innerHTML = '';
        Object.entries(data.finishes).forEach(([key, val]) => {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = val.name;
          finishSelect.appendChild(opt);
        });
        if (data.finishes[currentFinish]) {
          finishSelect.value = currentFinish;
        }
      }

      // Update Sizes if dropdown exists
      if (sizeSelect) {
        const currentSize = sizeSelect.value;
        sizeSelect.innerHTML = '';
        Object.entries(data.sizes).forEach(([key, val]) => {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = val;
          sizeSelect.appendChild(opt);
        });
        if (data.sizes[currentSize]) {
          sizeSelect.value = currentSize;
        }
      }

      // Update Quantities if dropdown exists
      if (quantitySelect) {
        const currentQty = quantitySelect.value;
        quantitySelect.innerHTML = '';
        data.quantities.forEach((qty) => {
          const opt = document.createElement('option');
          opt.value = qty;
          opt.textContent = qty.toLocaleString() + ' units';
          quantitySelect.appendChild(opt);
        });
        if (data.quantities.includes(Number(currentQty))) {
          quantitySelect.value = currentQty;
        } else {
          quantitySelect.value = data.quantities[Math.min(2, data.quantities.length - 1)];
        }
      }

      recalculate();
    }

    function recalculate() {
      const catVal = categorySelect ? categorySelect.value : 'business-cards';
      const finishVal = finishSelect ? finishSelect.value : '';
      const sizeVal = sizeSelect ? sizeSelect.value : '';
      const qtyVal = quantitySelect ? Number(quantitySelect.value) || 100 : 100;
      const turnVal = turnaroundSelect ? turnaroundSelect.value : 'standard';

      const result = calculateQuote(catVal, finishVal, sizeVal, qtyVal, turnVal);

      if (priceDisplay) priceDisplay.textContent = result.totalFormatted;
      if (summaryProduct) summaryProduct.textContent = result.categoryName;
      if (summarySpecs) summarySpecs.textContent = `${result.sizeName} • ${result.finishName}`;
      if (summaryQty) summaryQty.textContent = `${result.quantity.toLocaleString()} units`;
      if (summaryTurnaround) summaryTurnaround.textContent = result.turnaroundName;

      // Update WhatsApp URL with pre-filled message
      if (whatsappBtn) {
        const nameInput = widgetEl.querySelector('[data-calc-input="name"]');
        const notesInput = widgetEl.querySelector('[data-calc-input="notes"]');
        const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Valued Customer';
        const clientNotes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'None';

        const message = 
`Hello Merlimorris Printing Shop! 🖨️
I would like a free quotation / order for:

• Product: ${result.categoryName}
• Specifications: ${result.finishName}
• Size: ${result.sizeName}
• Quantity: ${result.quantity} units
• Turnaround: ${result.turnaroundName}
• Estimated Total: ${result.totalFormatted}
• Name: ${clientName}
• Notes / Delivery info: ${clientNotes}

Location: Unnappilavu, Mullaitivu delivery required. Please confirm proofing and timeline!`;

        const encodedMsg = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
      }
    }

    // Attach change listeners
    [categorySelect, finishSelect, sizeSelect, quantitySelect, turnaroundSelect].forEach((el) => {
      if (el) {
        el.addEventListener('change', () => {
          if (el === categorySelect) {
            updateOptions();
          } else {
            recalculate();
          }
        });
      }
    });

    const nameInput = widgetEl.querySelector('[data-calc-input="name"]');
    const notesInput = widgetEl.querySelector('[data-calc-input="notes"]');
    if (nameInput) nameInput.addEventListener('input', recalculate);
    if (notesInput) notesInput.addEventListener('input', recalculate);

    // Initial populate
    updateOptions();

    // Form submit listener
    const form = widgetEl.querySelector('form') || widgetEl.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const catVal = categorySelect ? categorySelect.value : 'business-cards';
        const finishVal = finishSelect ? finishSelect.value : '';
        const sizeVal = sizeSelect ? sizeSelect.value : '';
        const qtyVal = quantitySelect ? Number(quantitySelect.value) || 100 : 100;
        const turnVal = turnaroundSelect ? turnaroundSelect.value : 'standard';
        const result = calculateQuote(catVal, finishVal, sizeVal, qtyVal, turnVal);

        if (window.showToast) {
          window.showToast(`🎉 Quote generated for ${result.totalFormatted}! Opening WhatsApp to connect with our printing team...`);
        }

        setTimeout(() => {
          if (whatsappBtn && whatsappBtn.href) {
            window.open(whatsappBtn.href, '_blank');
          }
        }, 600);
      });
    }
  }

  // Expose global init
  window.initPrintingCalculator = function () {
    const widgets = document.querySelectorAll('[data-calculator-widget]');
    widgets.forEach((widget) => setupQuoteWidget(widget));
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPrintingCalculator);
  } else {
    window.initPrintingCalculator();
  }
})();
