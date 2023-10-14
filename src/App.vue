<template>
  <header>
    <TheNavBar />
  </header>

  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>

  <TheFooter />
</template>

<script>

  import TheNavBar from 'components/TheNavBar.vue'
  import TheFooter from 'components/TheFooter.vue'


  export default {
    name: 'App',
    components: {
      TheNavBar,
      TheFooter
    }
  }

</script>



<style>
  main {
    flex-grow: 1;
    min-height: calc(90vh - 50px);
  }
</style>