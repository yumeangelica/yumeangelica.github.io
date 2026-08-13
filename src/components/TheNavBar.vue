<template>
  <nav class="navbar navbar-expand-md navbar-light" role="navigation" :aria-label="$t('nav.ariaLabel')" @keydown.esc="closeNav">
    <a href="#main-content" class="visually-hidden-focusable">{{ $t('nav.skipToContent') }}</a>
    <div class="container-fluid">
      <!-- Toggler -->
      <button class="navbar-toggler ms-auto" type="button" @click="toggleNav" aria-controls="navbarNav" :aria-expanded="showNav ? 'true' : 'false'"
        :aria-label="$t('nav.toggleAriaLabel')">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Navbar links -->
      <div class="collapse navbar-collapse" :class="{ 'show': showNav, 'show-animate': showNav }" id="navbarNav">
        <ul class="navbar-nav ms-auto me-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link" @click="closeNav">{{ $t('nav.home') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'projects' }" class="nav-link" @click="closeNav">{{ $t('nav.projects') }}</router-link>
          </li>
          <li class="nav-item">
            <a href="https://github.com/yumeangelica" class="nav-link" target="_blank" rel="noopener" @click="closeNav"
              :aria-label="$t('common.externalLinkAriaLabel', { label: $t('nav.github') })">{{ $t('nav.github') }}</a>
          </li>
          <li class="nav-item">
            <a href="https://www.linkedin.com/in/yumeangelica/" class="nav-link" target="_blank" rel="noopener" @click="closeNav"
              :aria-label="$t('common.externalLinkAriaLabel', { label: $t('nav.linkedin') })">{{ $t('nav.linkedin') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

interface NavBarState {
  showNav: boolean
  resizeTimeout: number | null
}

export default defineComponent({
  name: 'TheNavBar',
  data(): NavBarState {
    return {
      showNav: false,
      resizeTimeout: null,
    }
  },
  methods: {
    toggleNav() {
      this.showNav = !this.showNav
    },
    closeNav() {
      this.showNav = false
    },
    handleResize() {
      // Throttle resize events for better performance
      if (this.resizeTimeout) return
      this.resizeTimeout = window.setTimeout(() => {
        if (window.innerWidth >= 768 && this.showNav) {
          this.showNav = false
        }
        this.resizeTimeout = null
      }, 100) // Less frequent than scroll events
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout)
    }
  },
})
</script>


<style scoped>
/* For accessibility (keyboard users), skip to main content link */
.visually-hidden-focusable {
  color: var(--color-primary);
  border: none;
  margin-left: max(10px, env(safe-area-inset-left, 0px));
}

.visually-hidden-focusable:focus,
.visually-hidden-focusable:active {
  outline: 2px solid var(--color-primary);
  position: absolute;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
  z-index: 1050;
  background: var(--color-nav-bg);
  padding: 5px 10px;
  border-radius: 4px;
}

/* Navbar overall styling */
nav {
  background: var(--color-nav-bg);
  margin-bottom: clamp(28px, 4vw, 44px);
  padding: 6px 0;
  box-shadow: var(--shadow-sm);
}

/* Navbar link styling */
.nav-link {
  position: relative;
  color: var(--color-primary);
  transition: color var(--transition-fast) ease-in-out;
}

/* Soft gradient underline that scales in on hover/focus and stays visible
   on the active route — calmer than the old background-fill jump. */
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.2em;
  width: min(100%, 3.5em);
  height: 2px;
  border-radius: var(--radius-pill);
  background: linear-gradient(to right, transparent, var(--color-primary), transparent);
  transform: translateX(-50%) scaleX(0);
  transition: transform var(--transition-fast) ease;
}

.nav-link:hover::after,
.nav-link:focus-visible::after,
.nav-link.router-link-active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link:hover {
  color: var(--color-primary-dark);
}

.nav-link.router-link-active {
  color: var(--color-accent);
  font-weight: 600;
}

/* Navbar item styling */
.nav-item {
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0 6px;
}

/* Navbar toggler icon customization — stroke uses the palette primary rgb(178, 77, 137) */
.navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='rgb(178, 77, 137)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>");
}

/* Toggler button styling */
.navbar-light .navbar-toggler {
  border-color: transparent;
}

.navbar-light .navbar-toggler:hover,
.navbar-light .navbar-toggler:focus {
  box-shadow: none;
}

/* Add better focus styles for all interactive elements */
.nav-link:focus-visible,
.navbar-toggler:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* The shared navbar-expand-md breakpoint switches to the desktop row at 768px. */
@media (min-width: 768px) {
  .navbar-nav {
    justify-content: center;
    width: 100%;
  }

  .nav-item {
    margin: 0 clamp(3px, 1vw, 7px);
    font-size: clamp(1rem, 2vw, 1.25rem);
  }
}

/* Phones and small tablets use the roomy collapsible menu. */
@media (max-width: 767.98px) {
  .navbar-light .navbar-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--tap-target-size);
    min-height: var(--tap-target-size);
    touch-action: manipulation;
  }

  /* Smaller mobile nav text is normal-size: use the darker token for AA contrast on the pink menu background */
  .nav-link {
    color: var(--color-primary-dark);
    /* Comfortable touch rows in the dropdown */
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--tap-target-size);
    padding: 0.25rem 1rem;
  }

  .nav-link.router-link-active {
    color: var(--color-primary-dark);
  }

  .navbar-collapse {
    position: absolute;
    top: calc(100% + 12px);
    right: max(10px, env(safe-area-inset-right, 0px));
    left: max(10px, env(safe-area-inset-left, 0px));
    transform: none;
    width: auto;
    max-width: none;
    max-height: calc(100vh - 160px);
    max-height: calc(100dvh - 160px);
    overflow-y: auto;
    overscroll-behavior: contain;
    background-color: var(--color-nav-bg);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 14px 22px;
    z-index: 1000;
  }

  /* Gentle reveal for the dropdown; frozen harmlessly by the global
     prefers-reduced-motion override. */
  .navbar-collapse.show-animate {
    animation: nav-menu-in var(--transition-fast) ease;
    transform-origin: top right;
  }

  .nav-item {
    width: 100%;
    text-align: center;
    font-size: 1rem;
    padding: 0;
  }

  .navbar-nav {
    flex-direction: column;
  }

  nav {
    position: relative;
  }
}

@keyframes nav-menu-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
