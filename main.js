/**
 * Merlimorris Printing Shop - Core Interactions & UI Scripts
 * Unnappilavu, Mullaitivu | Phone: +94 71 988 7110
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- Sticky Header Scroll ---
  const header = document.querySelector('.site-header');
  const floatingTopBtn = document.querySelector('.floating-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (floatingTopBtn) {
      if (scrollY > 350) {
        floatingTopBtn.classList.add('visible');
      } else {
        floatingTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile Navigation Drawer ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // --- Active Link Highlighting ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .drawer-link, .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // --- Toast Notification System ---
  let toastTimeout;
  window.showToast = function (message, duration = 4000) {
    let toast = document.querySelector('.toast-box');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-box';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="toast-message"></span>
      `;
      document.body.appendChild(toast);
    }

    const textSpan = toast.querySelector('.toast-message');
    if (textSpan) textSpan.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // --- Portfolio Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'flex';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => { item.style.display = 'none'; }, 200);
          }
        });
      });
    });
  }

  // --- FAQ Accordion & Live Search ---
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.querySelector('.faq-search-input');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others optionally for cleaner accordion
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active', !isActive);
      });
    }
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const qText = item.querySelector('.faq-question-btn')?.textContent.toLowerCase() || '';
        const aText = item.querySelector('.faq-answer-panel')?.textContent.toLowerCase() || '';
        if (qText.includes(query) || aText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // --- Artwork Upload & Drag-and-Drop Area ---
  const dropzone = document.querySelector('.upload-dropzone');
  const fileInput = document.querySelector('#artwork-file-input');
  const filesList = document.querySelector('.uploaded-files-list');

  if (dropzone && fileInput) {
    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, e => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, e => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
      });
    });

    dropzone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      handleFiles(files);
    });

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
    });

    function handleFiles(files) {
      if (!files || files.length === 0) return;

      const allowedExts = ['pdf', 'ai', 'psd', 'eps', 'tiff', 'tif', 'png', 'jpg', 'jpeg'];
      const maxSizeBytes = 100 * 1024 * 1024; // 100MB limit

      Array.from(files).forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedExts.includes(ext)) {
          window.showToast(`⚠️ Unsupported file format (.${ext}). Please upload PDF, AI, PSD, EPS, TIFF, JPG or PNG.`, 5000);
          return;
        }

        if (file.size > maxSizeBytes) {
          window.showToast(`⚠️ File "${file.name}" exceeds 100MB. Please use Google Drive or WeTransfer for large artwork.`, 5000);
          return;
        }

        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        if (filesList) {
          const pill = document.createElement('div');
          pill.className = 'file-item-pill';
          pill.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="background: rgba(255, 207, 36, 0.15); color: #FFCF24; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">
                ${ext}
              </span>
              <div>
                <strong style="color: #FFF; font-size: 0.95rem;">${file.name}</strong>
                <div style="color: #9E9696; font-size: 0.8rem;">${sizeFormatted} • Pre-flight check passed ✅</div>
              </div>
            </div>
            <button type="button" class="btn-remove-file" style="background: transparent; color: #EF4444; cursor: pointer; padding: 4px; font-weight: bold;">✕</button>
          `;

          pill.querySelector('.btn-remove-file').addEventListener('click', () => {
            pill.remove();
          });

          filesList.appendChild(pill);
          window.showToast(`✅ "${file.name}" uploaded & checked! Ready to attach to your printing quote.`);
        }
      });
    }
  }

  // --- Contact & Quote Forms Submission Handler ---
  document.querySelectorAll('form[data-direct-whatsapp]').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="customer_name"]')?.value || 'Valued Customer';
      const phone = form.querySelector('[name="customer_phone"]')?.value || '';
      const email = form.querySelector('[name="customer_email"]')?.value || '';
      const service = form.querySelector('[name="service_type"]')?.value || 'General Printing Inquiry';
      const quantity = form.querySelector('[name="order_quantity"]')?.value || 'Standard';
      const message = form.querySelector('[name="customer_message"]')?.value || 'Need a quick quotation';

      const text = 
`Hello Merlimorris Printing Shop! 🖨️
I am contacting you from your website for a printing quote:

• Name: ${name}
• Phone: ${phone}
• Email: ${email || 'N/A'}
• Service Required: ${service}
• Estimated Quantity: ${quantity}
• Message / Project Details: ${message}

Looking forward to your swift response and free proofing!`;

      window.showToast('🚀 Dispatching your quote directly to WhatsApp...');
      setTimeout(() => {
        window.open(`https://wa.me/94719887110?text=${encodeURIComponent(text)}`, '_blank');
      }, 700);
    });
  });

});
