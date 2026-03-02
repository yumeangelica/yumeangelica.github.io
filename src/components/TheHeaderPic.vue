<template>
  <div class="header-pic" role="img" :aria-label="$t('header.bannerAriaLabel')"></div>
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
  padding: 25px 20px 5px 20px;
  text-align: center;
  height: 100px;
  opacity: 0.7;
}
</style>