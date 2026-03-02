<template>
  <footer role="contentinfo" :aria-label="$t('footer.ariaLabel')">{{ $t('footer.copyright', { year }) }}</footer>
</template>

<script>
export default {
  name: 'TheFooter',
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>

<style>
footer {
  width: 100%;
  color: var(--color-text);
  text-align: center;
  padding: 15px;
  margin-top: 20px;
}

@media (max-width: 568px) {
  footer {
    font-size: 0.65rem;
    padding: 15px 5px;
  }
}
</style>