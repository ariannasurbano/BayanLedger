/**
 * BayanLedger — Municipal Project Monitoring & Budget Accountability
 * Interactive JavaScript & Motion Controller
 * Municipality of Sta. Cruz, Laguna
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Navigation
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const siteHeader = document.getElementById('siteHeader');

  if (menuToggle && mainNav) {
    const toggleNav = (open) => {
      const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
      mainNav.classList.toggle('open', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });

    // Close mobile nav on click outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !siteHeader?.contains(e.target)) {
        toggleNav(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleNav(false);
      }
    });
  }

  // 3. Header Scroll Glassmorphic Transformation
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Modal Dialogue Controller & Tabs
  const modal = document.getElementById('demoModal');
  const previewButton = document.getElementById('previewButton');
  const headerDemoBtn = document.getElementById('headerDemoBtn');
  const showcaseDemoBtn = document.getElementById('showcaseDemoBtn');
  const closeModal = document.getElementById('closeModal');
  const doneModal = document.getElementById('doneModal');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const copyToast = document.getElementById('copyToast');

  const activateTab = (targetTabId) => {
    tabButtons.forEach(btn => {
      const match = btn.getAttribute('data-tab') === targetTabId;
      btn.classList.toggle('active', match);
    });
    tabContents.forEach(content => {
      const match = content.id === targetTabId;
      content.classList.toggle('active', match);
    });
  };

  const showToast = (message = 'Hash copied to clipboard! ✓') => {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('show');
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 2200);
  };

  const openModal = (initialTab = 'tab-overview') => {
    if (!modal) return;
    modal.hidden = false;
    // Force layout reflow before transition
    void modal.offsetWidth;
    modal.classList.remove('is-closing');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (initialTab) {
      activateTab(initialTab);
    }
    closeModal?.focus();
  };

  const dismissModal = () => {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    modal.classList.add('is-closing');
    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      document.body.style.overflow = '';
      previewButton?.focus();
    }, 320);
  };

  previewButton?.addEventListener('click', () => openModal('tab-overview'));
  headerDemoBtn?.addEventListener('click', () => openModal('tab-overview'));
  showcaseDemoBtn?.addEventListener('click', () => openModal('tab-verify'));
  closeModal?.addEventListener('click', dismissModal);
  doneModal?.addEventListener('click', dismissModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) dismissModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      dismissModal();
    }
  });

  // Modal Tabs Navigation
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      if (targetTabId) activateTab(targetTabId);
    });
  });

  // Copy Hash functionality inside modal
  const modalCopyHashBtn = document.getElementById('modalCopyHashBtn');
  const modalBlockHash = document.getElementById('modalBlockHash');
  if (modalCopyHashBtn && modalBlockHash) {
    modalCopyHashBtn.addEventListener('click', () => {
      const textToCopy = modalBlockHash.textContent || '';
      navigator.clipboard?.writeText(textToCopy).then(() => {
        showToast('Block hash copied to clipboard! ✓');
        modalCopyHashBtn.textContent = 'Copied!';
        setTimeout(() => { modalCopyHashBtn.textContent = 'Copy'; }, 1800);
      }).catch(() => {
        showToast('Block hash copied! ✓');
      });
    });
  }

  // Hero Card Mini Copy Hash
  const heroCopyHashBtn = document.getElementById('heroCopyHashBtn');
  const heroLiveHash = document.getElementById('heroLiveHash');
  if (heroCopyHashBtn && heroLiveHash) {
    heroCopyHashBtn.addEventListener('click', () => {
      const textToCopy = heroLiveHash.textContent || '';
      navigator.clipboard?.writeText(textToCopy).then(() => {
        heroCopyHashBtn.textContent = 'COPIED!';
        heroLiveHash.classList.add('hash-highlight');
        setTimeout(() => {
          heroCopyHashBtn.textContent = 'COPY';
          heroLiveHash.classList.remove('hash-highlight');
        }, 1800);
      }).catch(() => {});
    });
  }

  // 5. Interactive Dashboard Simulation
  let blockCounter = 14892;
  const simBlockHeight = document.getElementById('simBlockHeight');
  const modalBlockHeight = document.getElementById('modalBlockHeight');
  const simDisbursed = document.getElementById('simDisbursed');
  const simProgressBar = document.getElementById('simProgressBar');
  const simMilestone = document.getElementById('simMilestone');
  const miniTxList = document.getElementById('miniTxList');
  const btnSimulateBlock = document.getElementById('btnSimulateBlock');
  const modalCommitBtn = document.getElementById('modalCommitBtn');

  const sampleEvents = [
    { title: 'Material Quality Inspection Passed', detail: 'Concrete compressive strength verified by Municipal Lab', amount: '+₱1,250,000.00', progress: 85, milestone: 'Phase 4: Curing & Shoulder Grading' },
    { title: 'Barangay Road Section Final Paving', detail: 'Brgy. Bagumbayan station 2+450 completed', amount: '+₱1,285,000.00', progress: 95, milestone: 'Phase 4: Final Asphalt Sealing' },
    { title: 'Commission on Audit (COA) Checkpoint', detail: 'Digital voucher match with bank settlement transaction', amount: 'Audit Cleared', progress: 100, milestone: 'Final Project Turn-over & Acceptance' }
  ];
  let eventIdx = 0;

  function simulateNewBlock() {
    blockCounter++;
    const currentEvent = sampleEvents[eventIdx % sampleEvents.length];
    eventIdx++;

    // Update Block Height with flash effect
    if (simBlockHeight) {
      simBlockHeight.textContent = `#${blockCounter.toLocaleString()}`;
      simBlockHeight.classList.add('stat-flash');
      setTimeout(() => simBlockHeight.classList.remove('stat-flash'), 800);
    }
    if (modalBlockHeight) {
      modalBlockHeight.textContent = `Block #${blockCounter.toLocaleString()}`;
    }

    // Update Progress Bar
    if (simProgressBar) simProgressBar.style.width = `${currentEvent.progress}%`;

    // Update Disbursed values
    if (simDisbursed) {
      const disbursedVal = currentEvent.progress === 100 
        ? '₱8,450,000 (100%)' 
        : currentEvent.progress >= 95 
        ? '₱8,027,500 (95%)' 
        : '₱7,182,500 (85%)';
      simDisbursed.textContent = disbursedVal;
      simDisbursed.classList.add('stat-flash');
      setTimeout(() => simDisbursed.classList.remove('stat-flash'), 800);
    }

    if (simMilestone) simMilestone.textContent = currentEvent.milestone;

    // Generate Random Hash
    const randomHex = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase();
    if (heroLiveHash) {
      heroLiveHash.textContent = `${randomHex}...`;
      heroLiveHash.classList.add('hash-highlight');
      setTimeout(() => heroLiveHash.classList.remove('hash-highlight'), 1200);
    }
    if (modalBlockHash) {
      modalBlockHash.textContent = `${randomHex}${Math.random().toString(16).substring(2, 18)}`;
    }

    // Append to Feed smoothly
    if (miniTxList) {
      const newRow = document.createElement('div');
      newRow.className = 'mini-transaction new-arrival';
      newRow.innerHTML = `
        <div class="mini-tx-info">
          <strong>Block #${blockCounter.toLocaleString()} • ${currentEvent.title}</strong>
          <small>Hash: ${randomHex} • ${currentEvent.detail}</small>
        </div>
        <span class="record-status">COMMITTED</span>
      `;
      miniTxList.insertBefore(newRow, miniTxList.firstChild);

      // Keep maximum 4 items
      if (miniTxList.children.length > 4) {
        miniTxList.removeChild(miniTxList.lastChild);
      }
    }
  }

  btnSimulateBlock?.addEventListener('click', () => {
    simulateNewBlock();
    btnSimulateBlock.textContent = '✓ Block Verified & Mined!';
    btnSimulateBlock.style.background = '#e8b64c';
    btnSimulateBlock.style.color = '#120e06';
    setTimeout(() => {
      btnSimulateBlock.textContent = '+ Simulate New Milestone Block Verification';
      btnSimulateBlock.style.background = '';
      btnSimulateBlock.style.color = '';
    }, 1600);
  });

  // Modal Commit Button Simulation
  if (modalCommitBtn) {
    modalCommitBtn.addEventListener('click', () => {
      const origText = modalCommitBtn.textContent;
      modalCommitBtn.textContent = 'Computing Cryptographic SHA-256 Hash...';
      modalCommitBtn.disabled = true;

      setTimeout(() => {
        modalCommitBtn.textContent = 'Verifying Quorum Signatures...';
      }, 700);

      setTimeout(() => {
        const randHash = '0x' + Math.random().toString(16).substring(2, 8) + '...committed';
        modalCommitBtn.innerHTML = `✓ Block Committed (${randHash})`;
        modalCommitBtn.style.background = '#70c46b';
        modalCommitBtn.style.color = '#0e1a0b';

        // Trigger simulation on dashboard too
        simulateNewBlock();
        showToast('Milestone successfully committed to municipal ledger! ✓');

        setTimeout(() => {
          modalCommitBtn.textContent = origText;
          modalCommitBtn.style.background = '';
          modalCommitBtn.style.color = '';
          modalCommitBtn.disabled = false;
        }, 3200);
      }, 1600);
    });
  }

  // 6. Dynamic Mouse Spotlight Effect for Feature Cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Clicking card opens the modal with the card's relevant tab
    card.addEventListener('click', () => {
      const targetTab = card.getAttribute('data-tab') || 'tab-overview';
      openModal(targetTab);
    });

    // Support keyboard activation (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetTab = card.getAttribute('data-tab') || 'tab-overview';
        openModal(targetTab);
      }
    });
  });

  // 7. Hero Visual 3D Holographic Parallax (Smoothed with RequestAnimationFrame)
  const heroVisual = document.getElementById('heroVisual');
  const ledgerCard = document.getElementById('ledgerCard');
  const ledgerStage = document.getElementById('ledgerStage');

  if (heroVisual && ledgerCard) {
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHovering = false;
    let rafId = null;

    const updateTilt = () => {
      if (window.innerWidth <= 980) {
        ledgerCard.style.transform = '';
        if (ledgerStage) ledgerStage.style.transform = '';
        rafId = null;
        return;
      }

      // Smooth linear interpolation (lerp damping)
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      ledgerCard.style.transform = `translateY(-50%) perspective(900px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${(currentTiltY - 7).toFixed(2)}deg)`;
      
      if (ledgerStage) {
        ledgerStage.style.transform = `translate(-50%, -50%) perspective(900px) rotateX(${(-currentTiltX * 0.35).toFixed(2)}deg) rotateY(${(-currentTiltY * 0.35).toFixed(2)}deg)`;
      }

      if (isHovering || Math.abs(targetTiltX - currentTiltX) > 0.02 || Math.abs(targetTiltY - currentTiltY) > 0.02) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        if (!isHovering) {
          ledgerCard.style.transform = '';
          if (ledgerStage) ledgerStage.style.transform = '';
        }
        rafId = null;
      }
    };

    heroVisual.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 980) return;
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetTiltX = -y * 13;
      targetTiltY = x * 15;
      isHovering = true;

      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    });

    heroVisual.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
      isHovering = false;
      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 980) {
        ledgerCard.style.transform = '';
        if (ledgerStage) ledgerStage.style.transform = '';
      }
    }, { passive: true });
  }

  // 8. Scroll Spy (Active Navigation Link Highlighting)
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('#mainNav a')];

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px' });

    sections.forEach(section => navObserver.observe(section));
  }

  // 9. Smooth Scroll-Triggered Reveal Animations (Without initial FOUC)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealElements = document.querySelectorAll(
      '.metrics .metric-item, .section-kicker, .section-heading-row, .about-panel, .about-details, .feature-card, .system-cta, .research-grid, .problem-list article, .team-card, .footer'
    );

    document.body.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // 10. Periodic Live Hash Ticker (simulating live ledger block generation)
  setInterval(() => {
    if (heroLiveHash) {
      const rand = '0x' + Math.random().toString(16).substring(2, 6).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase();
      heroLiveHash.textContent = rand;
      heroLiveHash.classList.add('hash-highlight');
      setTimeout(() => heroLiveHash.classList.remove('hash-highlight'), 1000);
    }
  }, 10000);
});
