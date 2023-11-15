<template>
  <h1>Elegant Web Development Creations</h1>

  <!-- cards will be componentized later -->
  <div class="projects-container">

    <!-- Fullstack phonebook app card -->
    <div class="project-card">
      <div class="project-image-container">
        <img src="../assets/img/fullstack-phonebook-application-project.webp" alt="Fullstack Phonebook App">
      </div>
      <div class="project-details">
        <h5>Fullstack phonebook app</h5>
        <p class="used-technologies">
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg"
            alt="MongoDB Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg"
            alt="Express.js Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" alt="React Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg" alt="CSS3 Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg" alt="HTML5 Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original-wordmark.svg"
            alt="Bootstrap Logo" />
        </p>
        <p class="heartbefore additional-info">Tests, CI/CD, Docker</p>
        <p class="heartbefore additional-info">Full-stack, CRUD functionality</p>
        <div class="buttons">
          <a href="https://fullstack-phonebook-application.fly.dev/" class="project-button" target="_blank">Learn More</a>
          <a href="https://github.com/yumeangelica/fullstack-phonebook-application" class="project-button" target="_blank">Source Code</a>
        </div>
      </div>
    </div>

    <!-- Personal portfolio card -->
    <div class="project-card">
      <div class="project-image-container">
        <img src="../assets/img/portfolio-project.webp" alt="Personal Portfolio">
      </div>
      <div class="project-details">
        <h5>Personal portfolio</h5>
        <p class="used-technologies">
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original-wordmark.svg" alt="Vue.js Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg" alt="CSS3 Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg" alt="HTML5 Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original-wordmark.svg"
            alt="Bootstrap Logo" />
        </p>
        <p class="heartbefore additional-info">Showcasing my Vue.js & website design skills</p>
        <p class="heartbefore additional-info">Front-end, design, accessibility, SEO</p>
        <div class="buttons">
          <a href="https://github.com/yumeangelica/yumeangelica.github.io/" class="project-button" target="_blank">Source Code</a>
        </div>
      </div>
    </div>

    <!-- Taitovarasto project card -->
    <div class="project-card">
      <div class="project-image-container">
        <img src="../assets/img/taitovarasto-project.webp" alt="Taitovarasto Project">
      </div>
      <div class="project-details">
        <h5>Taitovarasto for Virittämö as a client</h5>
        <p class="used-technologies">
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg"
            alt="MongoDB Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg"
            alt="Express.js Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" alt="React Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg" alt="CSS3 Logo" />
          <img class="small-devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg" alt="HTML5 Logo" />
        </p>
        <p class="heartbefore additional-info">Recruitment and skills showcase app. My role focused on back-end-centric full-stack development,
          including testing and CI/CD processes</p>
        <p class="heartbefore additional-info">Full-stack, CRUD functionality, Authentication</p>
      </div>
    </div>

  </div>
</template>


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

    .projects-container {
      flex-direction: column;
      align-items: center;
    }

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
