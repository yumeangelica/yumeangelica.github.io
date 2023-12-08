<template>
  <div class="project-card">
    <div class="project-image-container">
      <img :src="
        getProjectImageURL()
      " :alt="projectTitle" />
    </div>
    <div class="project-details">
      <h5>{{ projectTitle }}</h5>
      <p class="used-technologies">
        <img v-for="techName in technologyTitles" :key="techName" class="small-devicon" :src="getTechIconUrl(techName)" :alt="`${techName} Logo`" />
      </p>
      <p v-for="info in additionalInfo" :key="info" class="heartbefore additional-info">
        {{ info }}
      </p>
      <div class="buttons">
        <a v-for="link in links" :key="link.text" :href="link.url" class="project-button" target="_blank">
          {{ link.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  
  import taito from '../assets/img/taitovarasto-project.webp';
  import fullstack from '../assets/img/fullstack-phonebook-application-project.webp';
  import portfolio from '../assets/img/portfolio-project.webp';
  
  export default {
    props: { // props are passed from parent component
      project: Object,
      technologies: Array
    },
    data() {
      return { // data is local to this component and can be used in the template
        imageURL: "",
        projectTitle: this.project.title,
        additionalInfo: this.project.additionalInfo,
        links: this.project.links,
        technologyTitles: this.project.technologyTitles,
      }
    },
    methods: {
      getTechIconUrl(techName) { // finds the technology object from the technologies array and returns the url of the icon so it can be displayed in the template
        const tech = this.technologies.find(t => t.title === techName);
        return tech ? tech.url : '';
      },
      getProjectImageURL() {
        switch (this.projectTitle) {
          case "Taitovarasto for Virittämö as a client":
            return taito;
          case "Fullstack phonebook app":
            return fullstack;
          case "Personal portfolio":
            return portfolio;
        }
    }
  }
}

</script>




<style>
  .small-devicon {
    max-width: 40px;
    max-height: 40px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .used-technologies {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 15px;
  }

  .additional-info {
    margin-bottom: 0px !important;
    padding-bottom: 0px !important;
  }


  .project-card {
    display: flex;
    flex-direction: column;
    width: 380px;
    margin: 10px;
    background-color: var(--kawaii-purple);
    border-radius: 10px;
    max-height: 700px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
    overflow-y: auto;
    /* add scrollbar if content is too long */
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .project-image-container img {
    width: 100%;
    height: auto;
    /* display: block; */
    object-fit: cover;
    /* ensures that the image covers the entire container */
  }

  .project-details {
    flex: 1;
    /* ensures that the project details take up all the available space */
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .project-details h5 {
    color: var(--kawaii-dark-pink);
    margin-bottom: 5px;
    font-size: 1.1em;
    /* Suurempi otsikko */
  }

  .project-details p {
    color: var(--kawaii-font-color);
    font-size: 0.9em;
    margin-bottom: 10px;
  }

  .technology {
    font-weight: bold;
  }

  .buttons {
    margin-top: 15px;
    display: flex;
    justify-content: flex-start;
    /* aligns buttons to the left */
  }

  .project-button {
    text-decoration: none;
    color: var(--white);
    background-color: var(--kawaii-dark-pink);
    padding: 8px 15px;
    border-radius: 5px;
    transition: background-color 0.3s;
    margin-right: 10px;
  }

  .project-button:hover {
    background-color: var(--kawaii-light-pink);
  }

  .project-button:last-child {
    margin-right: 0;
  }




  /* mobile mode rules */
  @media (max-width: 600px) {

    .project-details p {
      font-size: 0.8em;
    }

    .project-details {
      padding: 10px;
    }

    .small-devicon {
      max-width: 25px;
      max-height: 25px;
    }

    .project-card {
      width: 100%;
      margin: 10px 0;
    }


    .buttons {
      display: flex;
      justify-content: flex-start;
      /* aligns buttons to the left */
      flex-wrap: wrap;
      /* allows buttons to wrap */
    }

    .project-button {
      padding: 5px;
      text-align: center;
      font-size: 0.85em !important;
      flex: none;
      margin-right: 5px;
      text-align: center;
    }

    .project-button:last-child {
      margin-bottom: 0;
    }
  }
</style>