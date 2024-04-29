<template>
  <h1 class="text-center">Web development projects</h1>
  <div class="projects-container">
    <TheProjectCard v-for="project in webDevelopmentProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

  <h2 class="text-center">Command-line Projects</h2>
  <div class="projects-container">
    <TheProjectCard v-for="project in commandLineProjects" :key="project.id" :project="project" :technologies="technologies" />
  </div>

</template>


<script>
import TheProjectCard from '../components/TheProjectCard.vue';
import { ref } from 'vue';

export default {
  data() {
    return {
      webDevelopmentProjects: ref([]),
      commandLineProjects: ref([]),
      technologies: ref([]),
      dataURL: '../data.json',
      dataHandleError: ref(false)
    }
  },
  components: {
    TheProjectCard
  },
  async created() { // when site is loaded, fetch data from data.json
    try {
      const response = await fetch(this.dataURL);
      const data = await response.json();
      if (data) { // if data is fetched successfully, assign it to projects and technologies
        this.technologies = data.technologies;
        this.webDevelopmentProjects = data.projects.filter(p => p.type === 'webDevelopment');
        this.commandLineProjects = data.projects.filter(p => p.type === 'commandLine');
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
  padding: 20px;
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
