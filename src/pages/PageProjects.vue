<template>
  <h1 class="text-center">Web development projects</h1>
  <div class="projects-container">
    <TheProjectCard v-for="project in webDevelopmentProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <h2 class="text-center">Command-line Projects</h2>
  <div class="projects-container">
    <TheProjectCard v-for="project in commandLineProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <!-- Not important projects -->
  <h3 class="text-center">Other Projects</h3>
  <div class="other-projects-container">
    <TheSmallerProjectCard v-for="project in otherProjects" :key="project.id" :project="project" />
  </div>
</template>


<script>
  import TheProjectCard from '../components/TheProjectCard.vue';
  import TheSmallerProjectCard from '../components/TheSmallerProjectCard.vue';
  import { ref } from 'vue';

  export default {
    data() {
      return {
        webDevelopmentProjects: ref([]),
        commandLineProjects: ref([]),
        otherProjects: ref([]),
        technologies: ref([]),
        dataURL: '../data.json',
        dataHandleError: ref(false)
      }
    },
    components: {
      TheProjectCard,
      TheSmallerProjectCard
    },
    async created() { // when site is loaded, fetch data from data.json
      try {
        const response = await fetch(this.dataURL);
        const data = await response.json();
        if (data) { // if data is fetched successfully, assign it to projects and technologies
          this.technologies = data.technologies;
          this.webDevelopmentProjects = data.projects.filter(p => p.type === 'webDevelopment');
          this.commandLineProjects = data.projects.filter(p => p.type === 'commandLine');
          this.otherProjects = data.projects.filter(p => p.type === 'otherProject');
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

  /* mobile mode rules */
  @media (max-width: 568px) {
    .projects-container {
      flex-direction: column;
      align-items: center;
      padding: 0px;
    }
  }
</style>
