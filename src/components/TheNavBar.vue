<template>
  <nav class="navbar navbar-expand-md navbar-light">
    <div class="container-fluid">
      <!-- toggler -->
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
import { RouterLink } from 'vue-router';
import { onMounted, onUnmounted } from 'vue'; // close navbar dropdown when window is resized

const showNav = ref(false); // ref, toggle navbar dropdown on mobile, starts as false

const toggleNav = () => {
  showNav.value = !showNav.value;
};

const closeNav = () => { // close navbar dropdown when link is clicked
  if (window.innerWidth < 992) { // bootstrap's lg breakpoint
    showNav.value = false;
  }
};


// close navbar dropdown when window is resized
const handleResize = () => {
  if (window.innerWidth >= 992 && showNav.value) {
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
/* Navbar overall styling */
nav {
  margin-bottom: 40px;
  background: var(--kawaii-pastel-lilac);
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Navbar link styling */
.nav-link {
  color: var(--kawaii-dark-purple) !important;
  transition: color 0.3s ease-in-out;
}

.nav-link.router-link-active {
  color: var(--kawaii-purple) !important;
  font-weight: bold;
}

/* Navbar item styling */
.nav-item {
  font-size: 1.3rem;
}

/* Hover and focus effects for nav items */
.nav-item:hover,
.nav-item:focus {
  background-color: var(--kawaii-light-pink);
  /* Light pink for hover state */
  border-radius: 5px;
}

/* Active link styling */
.nav-link.active {
  color: var(--kawaii-purple) !important;
  font-weight: bold;
}

/* Navbar toggler icon customization */
.navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='rgb(252, 122, 191)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>");
}

/* Toggler button styling */
.navbar-light .navbar-toggler {
  border-color: transparent;
}

/* Toggler button hover and focus effects */
.navbar-light .navbar-toggler:hover,
.navbar-light .navbar-toggler:focus {
  box-shadow: 0 0 0 2px rgba(252, 122, 191, .5);
}

/* Smooth transition for navbar collapse */
.collapse:not(.show) {
  display: none;
}

.collapse.show {
  display: block;
  transition: all 0.35s ease;
}

/* Media query for larger screens */
@media (min-width: 992px) {
  .navbar-nav {
    justify-content: center;
    /* Center navbar items */
    width: 100%;
    /* Full width */
  }

  .nav-item {
    margin: 0 10px;
    /* Spacing between nav items */
  }
}

/* Mobile styles */
@media (max-width: 991px) {
  .nav-item {
    width: 100%;
    /* Full width for mobile nav items */
    text-align: center;
    /* Center text for mobile nav items */
    font-size: 1.2rem;
    /* Slightly smaller font size for mobile nav items */
  }

  .navbar-collapse.collapsing {
    transition: height 0.35s ease;
    height: auto !important;
  }
}
</style>
