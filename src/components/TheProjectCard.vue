<template>
  <article class="project-card">
    <div class="project-image-container">
      <img :src="project.imageURL" :alt="projectTitle" loading="lazy" />
    </div>

    <div class="project-details">
      <h3>{{ projectTitle }}</h3>
      <div class="used-technologies" role="group" :aria-label="$t('projectCard.technologiesLabel')">
        <template v-for="techName in technologyTitles" :key="techName">
          <img v-if="getTechIconUrl(techName)" class="small-devicon" :src="getTechIconUrl(techName)" :alt="techName" :title="techName"
            loading="lazy" />
        </template>
      </div>
      <p v-for="info in additionalInfo" :key="info" class="heartbefore additional-info">
        {{ info }}
      </p>
      <div class="buttons">
        <a v-for="link in links" :key="link.text" :href="link.url" class="project-button" target="_blank" rel="noopener"
          :aria-label="$t('projectCard.linkAriaLabel', { linkText: link.text, projectTitle: projectTitle })">
          {{ link.text }}
        </a>
      </div>
    </div>
  </article>
</template>


<script>
export default {
  name: 'TheProjectCard',
  props: {
    project: { type: Object, required: true },
    technologies: { type: Array, required: true }
  },
  computed: {
    projectTitle() {
      return this.project?.title || '';
    },
    additionalInfo() {
      return Array.isArray(this.project?.additionalInfo) ? this.project.additionalInfo : [];
    },
    links() {
      return Array.isArray(this.project?.links) ? this.project.links : [];
    },
    technologyTitles() {
      return Array.isArray(this.project?.technologyTitles) ? this.project.technologyTitles : [];
    }
  },
  methods: {
    getTechIconUrl(techName) {
      const technologies = Array.isArray(this.technologies) ? this.technologies : [];
      const tech = technologies.find(t => t.title === techName);
      return tech ? tech.url : "";
    }
  }
};
</script>


<style scoped>
.small-devicon {
  max-width: 45px;
  max-height: 45px;
  border-radius: 5px;
}

.used-technologies {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.additional-info {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  color: var(--color-text) !important;
}

.project-card {
  background-color: var(--color-card-bg);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-duration), box-shadow var(--transition-duration);
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex: 1 1 calc(50% - 20px);
  max-width: 500px;
}

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
}

.project-image-container {
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  flex-shrink: 0;
}

.project-image-container img {
  width: 100%;
  height: auto;
  display: block;
}

.project-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 15px;
}

.project-details h3 {
  color: var(--color-heading);
  margin-bottom: 10px;
  font-size: 1.15rem;
  overflow-wrap: break-word;
}

.project-details p {
  color: var(--color-text);
  font-size: 0.9em;
  margin-bottom: 10px;
  overflow-wrap: break-word;
}

.buttons {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  padding-top: 14px;
}

.project-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  min-height: 44px;
  max-width: 100%;
  color: var(--color-white);
  background-color: var(--color-button);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  touch-action: manipulation;
  transition: background-color var(--transition-duration), color var(--transition-duration), box-shadow var(--transition-duration);
  font-size: 0.95rem;
}

.project-button:hover {
  background-color: var(--color-button-hover);
  color: var(--color-white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Add focus styles for better keyboard accessibility */
.project-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  background-color: var(--color-button-hover);
}

@media (min-width: 1280px) {
  .project-card {
    max-width: 540px;
  }
}

@media (max-width: 568px) {
  .project-details p {
    font-size: 0.8em;
    line-height: 1.65;
  }

  .project-details {
    padding: 10px;
  }

  .small-devicon {
    max-width: 30px;
    max-height: 30px;
  }

  .used-technologies {
    gap: 8px;
  }

  .project-card {
    width: 100%;
    margin: 10px 0;
    font-size: 0.9rem;
  }

  .buttons {
    gap: 8px;
    padding-top: 12px;
  }

  .project-button {
    min-width: 104px;
    padding: 9px 14px;
    font-size: 0.9rem;
  }
}
</style>
