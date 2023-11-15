<template>
  <footer>&copy; 2020 - {{ year }} yumeangelica.github.io. All Rights Reserved.</footer>
</template>

<script setup>
  const year = new Date().getFullYear()
</script>

<style>
  footer {
    bottom: 0;
    left: 0;
    width: 100%;
    color: var(--kawaii-font-color);
    text-align: center;
    padding: 15px;
    margin-top: 20px;
  }
</style>