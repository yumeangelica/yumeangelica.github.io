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
  position: relative;
  background-image: url(/assets/profile/sakurabanner.webp);
  background-position: center;
  background-size: cover;
  height: clamp(110px, 16vw, 170px);
}

/* Soft veil instead of element opacity: mutes the photo and melts it into
   the pink navbar below for a dreamier, less abrupt cut. */
.header-pic::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 250, 253, 0.4), rgba(255, 250, 253, 0.2) 45%, rgba(241, 199, 232, 0.45));
}
</style>
