<template>
  <section>
    <header class="header" id="header">
      <nav>
        <ul class="nav justify-content-center navbar">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link navtext">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'projects' }" class="nav-link navtext">Projects</router-link>
          </li>

          <li class="nav-item">
            <a href="https://github.com/yumeangelica" class="nav-link navtext" target="_blank">GitHub</a>
          </li>

          <li class="nav-item">
            <a href="https://www.linkedin.com/in/yumeangelica/" class="nav-link navtext" target="_blank">LinkedIn</a>
          </li>

        </ul>
      </nav>
    </header>
  </section>
</template>

<script setup>
  import { RouterLink } from 'vue-router'

</script>

<style>
  nav {
    margin-bottom: 30px;
    background: var(--kawaii-purple);
  }

  .nav-link {
    color: var(--kawaii-dark-pink) !important;
  }

  .navtext:hover,
  .navtext:active,
  .navtext:focus {
    text-decoration: underline;
  }


  /* will be added later */

  /* .dropdown-menu a {
    color: var(--navbar-link-color);
  } */

  /* .dropdown-item:hover {
    background-color: var(--navbar-bg-color);
    color: var(--link-hover-color);
  } */
</style>