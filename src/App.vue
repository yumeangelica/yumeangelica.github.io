<template>
  <header>
    <TheHeaderPic />
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
  import TheHeaderPic from 'components/TheHeaderPic.vue'


  export default {
    name: 'App',
    components: {
      TheNavBar,
      TheFooter,
      TheHeaderPic
    }
  }

</script>



<style>
  main {
    flex-grow: 1;
    min-height: calc(90vh - 50px);
  }
</style>