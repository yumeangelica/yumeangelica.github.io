<template>
  <h1>Elegant Web Development Creations</h1>
  <div class="projects-container">
    <TheProjectCard v-for="project in projects" :key="project.id" :project="project" :technologies="technologies" />
  </div>
</template>


<script>
  import TheProjectCard from '../components/TheProjectCard.vue';
  import { ref } from 'vue';

  export default {
    data() {
      return {
        projects: ref([]),
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
          this.projects = data.projects;
          this.technologies = data.technologies;
        }
      } catch (error) {
        this.dataHandleError = true;
        console.log(error.message);
      }
    }
  }

</script>



<style>
  .projects-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    /* ensures that cards are aligned to the left */
    align-items: stretch;
    /* ensures that all cards are the same height */
    padding: 20px;
    gap: 20px;
  }


  /* mobile mode rules */
  @media (max-width: 600px) {
    .projects-container {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
