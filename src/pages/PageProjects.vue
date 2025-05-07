<template>
  <!-- Page title -->
  <h1 id="projects-overview" class="text-center">My Project Portfolio</h1>

  <!-- Loading and error indicators -->
  <div v-if="loading" class="text-center" role="status" aria-live="polite">
    <p>Loading projects...</p>
  </div>

  <div v-if="dataHandleError" role="alert" class="error-message">
    <p>Sorry, there was an error loading projects. Please try again later.</p>
  </div>

  <!-- Main projects section -->
  <section aria-labelledby="main-projects">
    <h2 id="main-projects" class="text-center">Main projects</h2>
    <div class="projects-container" aria-live="polite" :aria-busy="loading">
      <TheProjectCard v-for="project in mainProjects" :key="project.id" :project="project" :technologies="technologies" />
    </div>
  </section>

  <!-- Other web development projects section -->
  <section aria-labelledby="web-dev-projects">
    <h2 id="web-dev-projects" class="text-center">Other web development projects</h2>
    <div class="projects-container" aria-live="polite" :aria-busy="loading">
      <TheProjectCard v-for="project in webDevelopmentProjects" :key="project.id" :project="project" :technologies="technologies" />
    </div>
  </section>

  <!-- Other command-line projects section -->
  <section aria-labelledby="cli-projects">
    <h2 id="cli-projects" class="text-center">Other command-line projects</h2>
    <div class="projects-container" aria-live="polite" :aria-busy="loading">
      <TheProjectCard v-for="project in commandLineProjects" :key="project.id" :project="project" :technologies="technologies" />
    </div>
  </section>

  <!-- VanillaJS projects section -->
  <section aria-labelledby="js-projects">
    <h2 id="js-projects" class="text-center">VanillaJS projects</h2>
    <div class="other-projects-container" aria-live="polite" :aria-busy="loading">
      <TheSmallerProjectCard v-for="project in vanillajsProjects" :key="project.id" :project="project" />
    </div>
  </section>
</template>

<script>
import TheProjectCard from '../components/TheProjectCard.vue';
import TheSmallerProjectCard from '../components/TheSmallerProjectCard.vue';
import { ref } from 'vue';

export default {
  data() {
    return {
      mainProjects: ref([]),
      webDevelopmentProjects: ref([]),
      commandLineProjects: ref([]),
      vanillajsProjects: ref([]),
      technologies: ref([]),
      dataURL: '../data.json',
      dataHandleError: ref(false), // If data fetching fails, show error message
      loading: ref(true) // For accessibility, show loading message while fetching data
    }
  },
  components: {
    TheProjectCard,
    TheSmallerProjectCard
  },
  async created() { // When site is loaded, fetch data from data.json
    try {
      const response = await fetch(this.dataURL);
      const data = await response.json();
      if (data) { // If data is fetched successfully, assign it to projects and technologies
        this.technologies = data.technologies;
        this.mainProjects = data.projects.filter(p => p.type === 'mainProject');
        this.webDevelopmentProjects = data.projects.filter(p => p.type === 'webDevelopment');
        this.commandLineProjects = data.projects.filter(p => p.type === 'commandLine');
        this.vanillajsProjects = data.projects.filter(p => p.type === 'vanillajsProject');
      }
      this.loading = false; // When data is fetched, set loading to false
    } catch (error) {
      this.dataHandleError = true;
      this.loading = false; // When data fetching fails, set loading to false
      console.log(error.message);
    }
  }
}

</script>



<style scoped>
.projects-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  align-items: stretch;
  padding: 10px;
  margin-bottom: 30px;
}

.other-projects-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

/* Mobile mode rules */
@media (max-width: 568px) {
  .projects-container {
    flex-direction: column;
    align-items: center;
    padding: 0px;
  }
}

/* Add styling for error message */
.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

/* Add focus styles for better keyboard navigation */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
