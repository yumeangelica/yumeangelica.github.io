<template>
  <!-- Main projects section -->
  <h1 class="text-center">Main projects</h1>
  <div class="projects-container">
    <TheProjectCard v-for="project in mainProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <!-- Other web development projects section -->
  <h2 class="text-center">Other web development projects</h2>
  <div class="projects-container">
    <TheProjectCard v-for="project in webDevelopmentProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <!-- Other command-line projects section -->
  <h2 class="text-center">Other command-line projects</h2>
  <div class="projects-container">
    <TheProjectCard v-for="project in commandLineProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <!-- VanillaJS projects section -->
  <h3 class="text-center">VanillaJS projects</h3>
  <div class="other-projects-container">
    <TheSmallerProjectCard v-for="project in vanillajsProjects" :key="project.id" :project="project" />
  </div>
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
      dataHandleError: ref(false)
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
    } catch (error) {
      this.dataHandleError = true;
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
</style>
