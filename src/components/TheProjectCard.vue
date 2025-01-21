<template>
  <div class="project-card">
    <div class="project-image-container">
      <img :src="getProjectImageURL()" :alt="projectTitle" />
    </div>

    <div class="project-details">
      <h5>{{ projectTitle }}</h5>
      <p class="used-technologies">
        <img v-for="techName in technologyTitles" :key="techName" class="small-devicon" :src="getTechIconUrl(techName)" :alt="techName" />
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
// Project image imports
import taitoVarasto from '../assets/img/taitovarasto-project.webp';
import fullstackPhoneBook from '../assets/img/fullstack-phonebook-application-project.webp';
import portfolioSite from '../assets/img/portfolio-project.webp';
import jobFinder from '../assets/img/job-finder-project.webp';
import onlineWeatherView from '../assets/img/online-weather-view-project.webp';
import weatherView from '../assets/img/weather-view-project.webp';
import needyPet from '../assets/img/needypet-project.webp';
import jiraiSweetiesDiscordBot from '../assets/img/jirai-sweeties-discord-bot-project.webp';
import bookBoutique from '../assets/img/book-boutique-project.webp';

// Tech icon imports
import piniaIcon from '../assets/img/pinia-for-vue-logo.webp';
import ionicIcon from '../assets/img/ionic-logo.svg';

export default {
  props: {
    project: Object,
    technologies: Array
  },
  data() {
    return {
      imageURL: "",
      projectTitle: this.project.title,
      additionalInfo: this.project.additionalInfo,
      links: this.project.links,
      technologyTitles: this.project.technologyTitles,
    }
  },
  methods: {
    getTechIconUrl(techName) {
      if (techName === 'Ionic') {
        return ionicIcon;
      }
      if (techName === 'Pinia') {
        return piniaIcon;
      }
      const tech = this.technologies.find(t => t.title === techName);
      return tech ? tech.url : '';
    },
    getProjectImageURL() {
      switch (this.projectTitle) {
        case "Discord bot for Jirai Sweeties server":
          return jiraiSweetiesDiscordBot;
        case "NeedyPet":
          return needyPet;
        case "Personal portfolio":
          return portfolioSite;
        case "Taitovarasto for Virittämö as a client":
          return taitoVarasto;
        case "Fullstack phonebook app":
          return fullstackPhoneBook;
        case "Job finder":
          return jobFinder;
        case "Online weather view":
          return onlineWeatherView;
        case "Weather view":
          return weatherView;
        case "BookBoutique":
          return bookBoutique;
        default:
          return '';
      }
    }
  }
}
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
}

.additional-info {
  margin-bottom: 0px !important;
  padding-bottom: 0px !important;
}

.project-card {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 10px;
  background-color: var(--color-card-bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex: 1 1 calc(50% - 20px);
  max-width: 500px;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.project-image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.project-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 15px;
}

.project-details h5 {
  margin-bottom: 10px;
}

.project-details p {
  color: var(--color-font-gray);
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
  text-decoration: none;
  color: var(--white);
  background-color: var(--color-btn-lilac);
  padding: 5px 10px;
  border-radius: 15px;
  transition: background-color var(--link-transition-duration), color var(--link-transition-duration);
  margin-right: 10px;
  font-size: 0.9rem;
}

.project-button:hover {
  background-color: var(--color-semi-dark-lilac);
}

.project-button:last-child {
  margin-right: 0;
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
