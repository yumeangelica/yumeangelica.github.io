<template>
  <article class="project-card">
    <div class="project-image-container">
      <img :src="project.imageURL" :alt="projectTitle" loading="lazy" />
    </div>

    <div class="project-details">
      <h3>{{ projectTitle }}</h3>
      <ul class="used-technologies" :aria-label="$t('projectCard.technologiesLabel')">
        <li v-for="techName in technologyTitles" :key="techName">
          <img v-if="getTechIconUrl(techName)" class="small-devicon" :src="getTechIconUrl(techName)" :alt="techName" :title="techName"
            loading="lazy" />
        </li>
      </ul>
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
      return this.project.title;
    },
    additionalInfo() {
      return this.project.additionalInfo;
    },
    links() {
      return this.project.links || [];
    },
    technologyTitles() {
      return this.project.technologyTitles;
    }
  },
  methods: {
    getTechIconUrl(techName) {
      const tech = this.technologies.find(t => t.title === techName);
      return tech ? tech.url : "";
    }
  }
};
</script>


<style scoped>
.small-devicon {
  max-width: 45px;
  max-height: 45px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.used-technologies {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  list-style: none;
  padding: 0;
}

.used-technologies li {
  display: inline-flex;
}

.additional-info {
  margin-bottom: 0px !important;
  padding-bottom: 0px !important;
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

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
}

.project-details p {
  color: var(--color-text);
  font-size: 0.90em;
  margin-bottom: 10px;
}

.buttons {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
  padding-top: 10px;
}

.project-button {
  color: var(--color-white);
  background-color: var(--color-button);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 15px;
  transition: background-color var(--transition-duration), color var(--transition-duration), box-shadow var(--transition-duration);
  margin-right: 10px;
  font-size: 0.9rem;
}

.project-button:hover {
  background-color: var(--color-button-hover);
  color: var(--color-white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.project-button:last-child {
  margin-right: 0;
}

/* Add focus styles for better keyboard accessibility */
.project-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  background-color: var(--color-button-hover);
}

/* Make sure card image has good focus indication when navigated to with keyboard */
.project-image-container img:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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

  .project-card {
    width: 100%;
    margin: 10px 0;
    font-size: 0.9rem;
  }

  .buttons {
    flex-wrap: wrap;
  }

  .project-button {
    padding: 5px;
    font-size: 0.85em !important;
    margin-right: 5px;
  }
}
</style>
