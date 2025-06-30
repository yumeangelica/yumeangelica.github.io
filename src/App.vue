<template>
  <div id="app">
    <header>
      <TheHeaderPic />
      <TheNavBar />
    </header>
    <main id="main-content" role="main" aria-label="Main site content">
      <div class="container-fluid">
        <div class="custom-container">
          <RouterView />
        </div>
      </div>
    </main>
    <TheFooter />
    <TheBackToTop />
  </div>
</template>

<script>
import TheNavBar from 'components/TheNavBar.vue'
import TheFooter from 'components/TheFooter.vue'
import TheHeaderPic from 'components/TheHeaderPic.vue'
import TheBackToTop from 'components/TheBackToTop.vue'

export default {
  name: 'App',
  components: {
    TheNavBar,
    TheFooter,
    TheHeaderPic,
    TheBackToTop
  }
}
</script>

<style>
body {
  overflow-x: hidden;
  /* Prevent horizontal scrolling */
}

.custom-container {
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: hidden;
  /* Prevent horizontal overflow */
}

main {
  flex-grow: 1;
  min-height: calc(90vh - 50px);
  overflow-x: hidden;
  /* Prevent horizontal overflow */
}

/* Tablet and small screen */
@media (max-width: 1440px) {
  .custom-container {
    margin: 0px 25px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .custom-container {
    margin: 0px 15px;
  }
}

/* Very small mobile */
@media (max-width: 568px) {
  .custom-container {
    margin: 0px 10px;
  }
}

/* Add global focus styles for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>