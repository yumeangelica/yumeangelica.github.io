<template>
  <footer role="contentinfo" :aria-label="$t('footer.ariaLabel')">{{ $t('footer.copyright', { year }) }}</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheFooter',
  data() {
    return {
      year: new Date().getFullYear(),
    }
  },
})
</script>

<style>
footer {
  width: 100%;
  color: var(--color-text);
  text-align: center;
  padding: 20px 15px 24px;
  margin-top: clamp(24px, 4vw, 40px);
  font-size: 0.9rem;
  /* Soft hairline above, same divider language as the page sections */
  background: linear-gradient(to right, transparent, var(--color-primary-light), transparent) top center / min(420px, 70%) 1px no-repeat;
}

/* Decorative ♡ before the copyright; pseudo-content with empty alt so
   screen readers skip it */
footer::before {
  content: '♡  ' / '';
  color: var(--color-primary);
}

@media (max-width: 568px) {
  footer {
    font-size: 0.8rem;
    padding: 18px 5px 20px;
  }
}
</style>
