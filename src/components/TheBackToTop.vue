<template>
  <Transition name="fade">
    <button v-if="isVisible" @click="scrollToTop" class="back-to-top" aria-label="Scroll back to top" title="Back to top">
      ↑
    </button>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'TheBackToTop',
  setup() {
    const isVisible = ref(false);

    const handleScroll = () => {
      // Show the button when scrolled down more than 300px
      isVisible.value = window.scrollY > 300;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      isVisible,
      scrollToTop
    };
  }
};
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-duration) ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

/* Fade transition animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Mobile styles */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}

/* Small mobile screens */
@media (max-width: 568px) {
  .back-to-top {
    bottom: 15px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .back-to-top {
    transition: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: none;
  }
}
</style>
