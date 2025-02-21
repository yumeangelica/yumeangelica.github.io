<template>
  <header>
    <TheHeaderPic />
    <TheNavBar />
  </header>
  <main>
    <div class="container-fluid">
      <div class="custom-container">
        <RouterView />
      </div>
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
.custom-container {
  max-width: 1400px;
  margin: 0px 90px;
  padding: 0px 15px;
}

main {
  flex-grow: 1;
  min-height: calc(90vh - 50px);
}

@media (max-width: 768px) {
  .custom-container {
    margin: 0px 5px;
  }
}
</style>