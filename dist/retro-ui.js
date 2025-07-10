/*!
 * Retro UI - Vanilla JavaScript
 * Optional enhancements for better UX
 * Version: 1.0.0
 */

(function(window, document) {
  'use strict';

  // Namespace for all RetroUI functionality
  const RetroUI = {
    version: '1.0.0',
    
    // Configuration
    config: {
      closeOnOutsideClick: true,
      closeOnEscape: true,
      animationDuration: 300,
      debug: false
    },
    
    // Utility functions
    utils: {
      // Simple logging
      log: function(message) {
        if (RetroUI.config.debug) {
          console.log('[RetroUI]', message);
        }
      },
      
      // Check if element is visible
      isVisible: function(element) {
        return element && element.offsetParent !== null;
      },
      
      // Get all focusable elements
      getFocusableElements: function(element) {
        return element.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
      },
      
      // Trap focus within an element
      trapFocus: function(element) {
        const focusableElements = this.getFocusableElements(element);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
              }
            }
          }
        });
        
        // Focus first element
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    },
    
    // Progress bar functionality
    ProgressBar: {
      // Update progress bar value
      update: function(element, value) {
        if (typeof element === 'string') {
          element = document.querySelector(element);
        }
        
        if (element && element.classList.contains('retro-progress')) {
          const clampedValue = Math.max(0, Math.min(100, value));
          element.style.setProperty('--progress', clampedValue);
          element.setAttribute('data-progress', clampedValue);
          element.setAttribute('aria-valuenow', clampedValue);
          
          RetroUI.utils.log(`Progress updated to ${clampedValue}%`);
        }
      },
      
      // Animate progress bar
      animate: function(element, targetValue, duration = 1000) {
        if (typeof element === 'string') {
          element = document.querySelector(element);
        }
        
        if (!element || !element.classList.contains('retro-progress')) {
          return;
        }
        
        const startValue = parseInt(element.style.getPropertyValue('--progress') || '0');
        const endValue = Math.max(0, Math.min(100, targetValue));
        const startTime = Date.now();
        
        function updateProgress() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          const currentValue = startValue + (endValue - startValue) * easeProgress;
          
          RetroUI.ProgressBar.update(element, currentValue);
          
          if (progress < 1) {
            requestAnimationFrame(updateProgress);
          }
        }
        
        requestAnimationFrame(updateProgress);
      }
    },
    
    // Dropdown enhancements
    Dropdown: {
      init: function() {
        const dropdowns = document.querySelectorAll('.retro-dropdown, details[data-retro-dropdown]');
        
        dropdowns.forEach(function(dropdown) {
          // Close on outside click
          if (RetroUI.config.closeOnOutsideClick) {
            document.addEventListener('click', function(e) {
              if (dropdown.open && !dropdown.contains(e.target)) {
                dropdown.open = false;
              }
            });
          }
          
          // Close on escape key
          if (RetroUI.config.closeOnEscape) {
            dropdown.addEventListener('keydown', function(e) {
              if (e.key === 'Escape' && dropdown.open) {
                dropdown.open = false;
                dropdown.querySelector('summary').focus();
              }
            });
          }
          
          // Handle keyboard navigation
          dropdown.addEventListener('keydown', function(e) {
            if (!dropdown.open) return;
            
            const items = dropdown.querySelectorAll('.retro-dropdown-item');
            const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
            
            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[nextIndex].focus();
                break;
              case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prevIndex].focus();
                break;
            }
          });
          
          // Add ARIA attributes
          const summary = dropdown.querySelector('summary');
          const content = dropdown.querySelector('.retro-dropdown-content');
          
          if (summary && content) {
            summary.setAttribute('aria-haspopup', 'true');
            summary.setAttribute('aria-expanded', dropdown.open ? 'true' : 'false');
            content.setAttribute('role', 'menu');
            
            // Update aria-expanded when dropdown opens/closes
            dropdown.addEventListener('toggle', function() {
              summary.setAttribute('aria-expanded', dropdown.open ? 'true' : 'false');
            });
          }
        });
      }
    },
    
    // Accordion enhancements
    Accordion: {
      init: function() {
        const accordions = document.querySelectorAll('details[data-retro-accordion]');
        
        accordions.forEach(function(accordion) {
          // Add smooth animation
          accordion.addEventListener('toggle', function() {
            const content = accordion.querySelector('.retro-accordion-content');
            if (content) {
              if (accordion.open) {
                content.style.animation = 'retro-accordion-expand 0.3s ease';
              }
            }
          });
          
          // Handle keyboard navigation
          accordion.addEventListener('keydown', function(e) {
            const summary = accordion.querySelector('summary');
            
            if (e.target === summary && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              accordion.open = !accordion.open;
            }
          });
          
          // Add ARIA attributes
          const summary = accordion.querySelector('summary');
          const content = accordion.querySelector('.retro-accordion-content');
          
          if (summary && content) {
            summary.setAttribute('aria-expanded', accordion.open ? 'true' : 'false');
            content.setAttribute('role', 'region');
            
            // Update aria-expanded when accordion opens/closes
            accordion.addEventListener('toggle', function() {
              summary.setAttribute('aria-expanded', accordion.open ? 'true' : 'false');
            });
          }
        });
      }
    },
    
    // Modal enhancements
    Modal: {
      init: function() {
        const modals = document.querySelectorAll('.retro-modal');
        
        modals.forEach(function(modal) {
          // Close on outside click
          if (RetroUI.config.closeOnOutsideClick) {
            modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                RetroUI.Modal.close(modal);
              }
            });
          }
          
          // Close on escape key
          if (RetroUI.config.closeOnEscape) {
            modal.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                RetroUI.Modal.close(modal);
              }
            });
          }
          
          // Handle close button
          const closeButton = modal.querySelector('.retro-modal-close');
          if (closeButton) {
            closeButton.addEventListener('click', function(e) {
              e.preventDefault();
              RetroUI.Modal.close(modal);
            });
          }
          
          // Trap focus when modal is open
          modal.addEventListener('transitionend', function() {
            if (modal.matches(':target')) {
              RetroUI.utils.trapFocus(modal);
            }
          });
        });
      },
      
      // Open modal
      open: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          window.location.hash = modalId;
          document.body.style.overflow = 'hidden';
          
          RetroUI.utils.log(`Modal opened: ${modalId}`);
        }
      },
      
      // Close modal
      close: function(modal) {
        if (typeof modal === 'string') {
          modal = document.getElementById(modal);
        }
        
        if (modal) {
          window.location.hash = '';
          document.body.style.overflow = '';
          
          RetroUI.utils.log('Modal closed');
        }
      }
    },
    
    // Theme management
    Theme: {
      // Set theme colors
      setColors: function(colors) {
        const root = document.documentElement;
        
        Object.keys(colors).forEach(function(key) {
          root.style.setProperty(`--retro-${key}`, colors[key]);
        });
        
        RetroUI.utils.log('Theme colors updated');
      },
      
      // Reset to default theme
      reset: function() {
        const root = document.documentElement;
        const customProperties = [
          '--retro-primary-bg',
          '--retro-primary-text',
          '--retro-primary-shadow',
          '--retro-secondary-bg',
          '--retro-secondary-text',
          '--retro-secondary-shadow',
          '--retro-button-bg',
          '--retro-button-text',
          '--retro-button-shadow',
          '--retro-card-bg',
          '--retro-card-text',
          '--retro-card-shadow',
          '--retro-input-bg',
          '--retro-input-text'
        ];
        
        customProperties.forEach(function(property) {
          root.style.removeProperty(property);
        });
        
        RetroUI.utils.log('Theme reset to default');
      }
    },
    
    // Initialize all components
    init: function(options = {}) {
      // Override default config
      Object.assign(RetroUI.config, options);
      
      // Initialize all components
      RetroUI.Dropdown.init();
      RetroUI.Accordion.init();
      RetroUI.Modal.init();
      
      // Set up global event listeners
      document.addEventListener('keydown', function(e) {
        // Global escape key handler
        if (e.key === 'Escape') {
          // Close any open dropdowns
          const openDropdowns = document.querySelectorAll('.retro-dropdown[open], details[data-retro-dropdown][open]');
          openDropdowns.forEach(function(dropdown) {
            dropdown.open = false;
          });
        }
      });
      
      RetroUI.utils.log('RetroUI initialized');
    }
  };
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', RetroUI.init);
  } else {
    RetroUI.init();
  }
  
  // Expose RetroUI to global scope
  window.RetroUI = RetroUI;
  
})(window, document);