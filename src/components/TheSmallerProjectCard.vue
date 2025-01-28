<template>
  <div class="simple-project-card">
    <h5>{{ project.title }}</h5>
    <div v-if="project.additionalInfo && project.additionalInfo.length" class="additional-info-container">
      <p v-for="info in project.additionalInfo" :key="info" class="additional-info">
        {{ info }}
      </p>
    </div>
    <div class="project-links">
      <a v-for="(link, index) in project.links" :key="index" :href="link.url" target="_blank" class="project-button">
        {{ link.text }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.simple-project-card {
  background-color: var(--color-card-bg);
  color: var(--color-text);
  padding: 15px;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.simple-project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.simple-project-card h5 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: var(--color-heading);
}

.additional-info-container {
  margin-bottom: 10px;
}

.additional-info {
  font-size: 0.9em;
  color: var(--color-text);
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.project-button {
  text-decoration: none;
  color: var(--color-white);
  background-color: var(--color-button);
  padding: 4px 8px;
  border-radius: 12px;
  transition: background-color var(--transition-duration), color var(--transition-duration);
  font-size: 0.85rem;
  flex: 1 1 auto;
  text-align: center;
}

.project-button:hover {
  background-color: var(--color-button-hover);
}

@media (max-width: 568px) {
  .simple-project-card {
    width: 100%;
    padding: 10px;
    font-size: 0.9rem;
  }

  .simple-project-card h5 {
    font-size: 1em;
  }

  .additional-info {
    font-size: 0.8em;
    line-height: 1.65;
  }

  .project-button {
    padding: 5px;
    font-size: 0.85em !important;
    margin-right: 5px;
  }

  .project-links {
    gap: 5px;
  }
}
</style>
