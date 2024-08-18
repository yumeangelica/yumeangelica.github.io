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
    background: var(--color-pastel-lilac);
    padding: 5px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Navbar link styling */
  .nav-link {
    color: var(--color-dark-lilac) !important;
    transition: color 0.3s ease-in-out;
  }

  .nav-link.router-link-active {
    color: var(--color-highlighted-lilac) !important;
    font-weight: bold;
  }

  /* Navbar item styling */
  .nav-item {
    font-size: 1.35rem;
    font-weight: 500;
    padding: 0px 6px;
  }

  /* Hover and focus effects for nav items */
  .nav-item:hover,
  .nav-item:focus {
    background-color: var(--kawaii-light-pink);
    color: var(--color-highlighted-lilac);
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

  /* Toggler button hover and focus effects */
  .navbar-light .navbar-toggler:hover,
  .navbar-light .navbar-toggler:focus {
    box-shadow: none;
  }


  /* Media query for larger screens */
  @media (min-width: 992px) {
    .navbar-nav {
      justify-content: center;
      width: 100%;
    }

    .nav-item {
      margin: 0 8px;
    }
  }

  /* Mobile styles */
  @media (max-width: 425px) {
    .navbar-collapse {
      position: absolute;
      top: 125%;
      /* Adds more space between navbar and dropdown */
      left: 80%;
      /* Move dropdown to the right */
      transform: translateX(-70%);
      /* Fix centering */
      max-width: 85%;
      background-color: var(--color-pastel-lilac);
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
      /* Lisää mukavuutta väleihin */
    }

    /* Removes the default focus and hover effects */
    .nav-item:focus,
    .nav-item:hover {
      background-color: var(---color-pastel-lilac);
    }

    .navbar-nav {
      flex-direction: column;
    }

    nav {
      position: relative;
    }
  }
</style>
