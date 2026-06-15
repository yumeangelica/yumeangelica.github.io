<template>
  <!-- Decorative banner: conveys no information, so it is hidden from assistive tech -->
  <div class="header-pic" aria-hidden="true"></div>
</template>

<script>
export default {
  name: 'TheHeaderPic'
};
</script>

<style>
.header-pic {
  background-image: url(/assets/profile/sakurabanner.webp);
  background-position: center;
  background-size: cover;
  padding: 25px 20px 5px;
  text-align: center;
  height: 100px;
  opacity: 0.7;
}
</style>
