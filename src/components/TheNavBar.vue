<template>
  <nav class="navbar navbar-expand-md navbar-light" role="navigation" aria-label="Main navigation">
    <a href="#main-content" class="visually-hidden-focusable">Skip to main content</a>
    <div class="container-fluid">
      <!-- Toggler -->
      <button class="navbar-toggler ms-auto" type="button" @click="toggleNav" aria-controls="navbarNav" :aria-expanded="showNav ? 'true' : 'false'"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Navbar links -->
      <div class="collapse navbar-collapse" :class="{ 'show': showNav, 'show-animate': showNav }" id="navbarNav">
        <ul class="navbar-nav ms-auto me-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link navtext" aria-current="page" @click="closeNav">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'projects' }" class="nav-link navtext" @click="closeNav">Projects</router-link>
          </li>
          <li class="nav-item">
            <a href="https://github.com/yumeangelica" class="nav-link navtext" target="_blank" @click="closeNav">GitHub</a>
          </li>
          <li class="nav-item">
            <a href="https://www.linkedin.com/in/yumeangelica/" class="nav-link navtext" target="_blank" @click="closeNav">LinkedIn</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { ref } from 'vue';
import { onMounted, onUnmounted } from 'vue';

const showNav = ref(false);

const toggleNav = () => {
  showNav.value = !showNav.value;
};

const closeNav = () => {
  showNav.value = false;
};

const handleResize = () => {
  if (window.innerWidth >= 425 && showNav.value) {
    showNav.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>


<style scoped>
/* For accessibility (keyborad users), skip to main content link */
.visually-hidden-focusable {
  color: var(--color-primary) !important;
  border: none;
  margin-left: 10px;
}

.visually-hidden-focusable:focus,
.visually-hidden-focusable:active {
  outline: none;
  border: none;
  color: var(--color-primary);
}

/* Navbar overall styling */
nav {
  background: var(--color-nav-bg);
  margin-bottom: 40px;
  padding: 4px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Navbar link styling */
.nav-link {
  color: var(--color-primary) !important;
  transition: color 0.3s ease-in-out;
}

.nav-link.router-link-active {
  color: var(--color-accent) !important;
  font-weight: bold;
}

/* Navbar item styling */
.nav-item {
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0 6px;
}

/* Hover and focus effects for nav items */
.nav-item:hover,
.nav-item:focus {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 5px;
}

/* Navbar toggler icon customization */
.navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='rgb(252, 122, 191)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>");
}

/* Toggler button styling */
.navbar-light .navbar-toggler {
  border-color: transparent;
}

.navbar-light .navbar-toggler:hover,
.navbar-light .navbar-toggler:focus {
  box-shadow: none;
}

/* Styles for large screens (992px and up) */
@media (min-width: 992px) {
  .navbar-nav {
    justify-content: center;
    width: 100%;
  }

  .nav-item {
    margin: 0 7px;
    font-size: 1.25rem;
  }
}

/* Styles for medium screens (425.1px to 991.9px) */
@media (min-width: 425.1px) and (max-width: 991.9px) {
  .navbar-nav {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .collapse:not(.show) {
    display: flex !important;
  }

  .collapse {
    position: static;
    display: flex !important;
    max-height: none;
    width: 100%;
    background: transparent;
    box-shadow: none;
    margin-left: 0;
    padding-right: 0;
    justify-content: center;
  }

  .navbar-nav .nav-item {
    padding: 0 8px;
    margin: 0 4px;
    font-size: 1.15rem;
  }

  .navbar-toggler {
    display: none;
    /* Hide the toggler */
  }
}

/* Mobile styles for small screens (max-width: 425px) */
@media (max-width: 425px) {
  .navbar-collapse {
    position: absolute;
    top: 125%;
    left: 80%;
    transform: translateX(-70%);
    max-width: 85%;
    background-color: var(--color-nav-bg);
    border-radius: 15px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    padding: 20px 25px;
    z-index: 1000;
  }

  .nav-item {
    width: 100%;
    text-align: center;
    font-size: 1rem;
    padding: 5px 10px;
  }

  .nav-item:focus,
  .nav-item:hover {
    background-color: var(--color-primary-light);
  }

  .navbar-nav {
    flex-direction: column;
  }

  nav {
    position: relative;
  }
}
</style>
