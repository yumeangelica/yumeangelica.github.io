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
  margin: 0 auto;
}

main {
  flex-grow: 1;
  min-height: calc(90vh - 50px);
}

/* Tablet and small screen */
@media (max-width: 1440px) {
  .custom-container {
    margin: 0px 45px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .custom-container {
    margin: 0px 5px;
  }
}
</style>