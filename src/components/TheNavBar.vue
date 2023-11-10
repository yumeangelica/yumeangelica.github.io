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
            <router-link :to="{ name: 'home' }" class="nav-link active navtext" aria-current="page" @click="closeNav">Home</router-link>
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


<style>
  /* for hamburger model dropdown opening */
  @keyframes expandHeight {
    from {
      opacity: 0;
      height: 0;
    }

    to {
      opacity: 1;
      height: var(--expanded-height, 200px);
      /* 200px is the default height */
    }
  }

  /* for smooth opening animation for hamburger model dropdown */
  .show-animate {
    animation: expandHeight 0.5s ease-out;
  }


  /* navbar formatting to center links */
  @media (min-width: 992px) {
    .navbar-nav {
      justify-content: center;
      width: 100%;
    }
  }

  nav {
    margin-bottom: 30px;
    background: var(--kawaii-purple);
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }


  .nav-link {
    color: var(--kawaii-dark-pink) !important;
  }


  .nav-item {
    font-size: 120%;
    font-weight: 600;
    padding: 3px 5px 3px 5px;
  }


  .navtext:hover,
  .navtext:active,
  .navtext:focus {
    color: var(--kawaii-hover-color) !important;
    transition: color var(--kawaii-transition-duration) ease;
    text-decoration: none;
  }

  .navbar-light .navbar-toggler-icon {
    /* hamburger icon */
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='rgb(252, 122, 191)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>");
  }

  .navbar-light .navbar-toggler {
    border-color: transparent;
    color: transparent;
    outline: none;
  }

  .navbar-light .navbar-toggler:hover {
    box-shadow: 0 0 0 2px rgba(252, 122, 191, .5);
  }
</style>