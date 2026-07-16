<template>
  <div id="app">
    <header>
      <TheHeaderPic />
      <TheNavBar />
    </header>
    <main id="main-content" role="main" :aria-label="$t('app.mainContentAriaLabel')">
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

<script lang="ts">
import TheBackToTop from 'components/TheBackToTop.vue'
import TheFooter from 'components/TheFooter.vue'
import TheHeaderPic from 'components/TheHeaderPic.vue'
import TheNavBar from 'components/TheNavBar.vue'
import { defineComponent } from 'vue'
import { updateSeo } from './seo'

export default defineComponent({
  name: 'App',
  components: {
    TheNavBar,
    TheFooter,
    TheHeaderPic,
    TheBackToTop,
  },
  mounted() {
    this.updateSeo()
  },
  watch: {
    $route() {
      this.updateSeo()
    },
  },
  methods: {
    updateSeo() {
      updateSeo(this.$route, this.$t)
    },
  },
})
</script>

<style>
body {
  overflow-x: hidden;
}

.custom-container {
  max-width: 1400px;
  margin: 0 auto;
  /* Fluid gutter replaces the old per-breakpoint margin overrides */
  padding: 0 clamp(10px, 3vw, 25px);
}

main {
  flex-grow: 1;
  min-height: calc(90vh - 50px);
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
