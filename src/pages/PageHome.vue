<template>
  <h1>Dive into My World of Code and Creativity</h1>

  <div class="row">
    <div class="col-lg-7">

      <p>I'm a passionate full-stack developer with a flair for creative problem-solving. My background in Business Administration, specializing in
        Marketing and Communications, complements my technical skills. Starting my programming journey in 2020, I have since been dedicated to mastering
        web development through various academic and self-directed studies.</p>

      <h2>Main languages and frameworks:</h2>

      <p class="introduction-highlights-paragraph">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg" alt="Express.js Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" alt="React Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original-wordmark.svg" alt="Vue.js Logo" />
      </p>

      <p class="introduction-highlights-paragraph">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg" alt="CSS3 Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg" alt="HTML5 Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original-wordmark.svg" alt="Bootstrap Logo" />
      </p>

      <p class="introduction-highlights-paragraph">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original-wordmark.svg" alt="Git Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg" alt="GitHub Logo" />
        <img class="devicon" src="../assets/img/github-actions-logo.svg" alt="GitHub Actions Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg" alt="Docker Logo" />
      </p>

      <p class="introduction-highlights-paragraph">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg" alt="Python Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original-wordmark.svg" alt="SQLite Logo" />
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg"
          alt="PostgreSQL Logo" />
      </p>

      <h2>Other developer skills:</h2>
      <p class="introduction-highlights-paragraph other-dev-skills">
        <span class="heartbefore col">CI/CD</span>
        <span class="heartbefore col">REST-apis</span>
        <span class="heartbefore col">Testing (Jest, Cypress, SuperTest)</span>
        <span class="heartbefore col">Design with Figma</span>
        <span class="heartbefore col">Agile methodologies</span>
        <span class="heartbefore col">Communication</span>
        <span class="heartbefore col">Cybersecurity</span>
        <span class="heartbefore col">Digital marketing</span>
        <span class="heartbefore col">Web accessibility</span>
        <span class="heartbefore col">Usability</span>
        <span class="heartbefore col">SEO</span>
        <span class="heartbefore col">AI prompt engineering</span>
      </p>

      <section class="education">
        <div class="heartlist-small">
          <h2>My developer journey</h2>
          <ul role="presentation">
            <li>Full-time role as a dedicated full-stack developer at Virittämö Helsinki.</li>
            <li>Bachelor of Science in Business Administration from the University of Vaasa.</li>
            <li>Pursued computer science as part of Helsinki University's DEFA project courses.</li>
            <li>Successfully completed the Full-stack Open course series, gaining valuable skills for a full-stack development career.</li>
            <li>Currently pursuing further programming studies while working as a full-stack developer at Virittämö.</li>
          </ul>
        </div>
      </section>
    </div>

    <div class="col-md-auto">
      <img src="../assets/img/angelica_profilepic.jpeg" class="img-responsive profilepic" alt="Angelica's Profile Picture">
    </div>
  </div>

  <section class="interesting-fact">
    <h2>A bit about me</h2>
    <p>When not immersed in coding, I indulge in my love for producing music and exploring Japanese fashion and culture, which fuels my creativity and
      brings a unique perspective to my work in tech.</p>
  </section>

  <section class="commitment">
    <h2>My Commitment</h2>
    <p>With a deep-rooted passion for programming, I'm committed to continual learning and skill enhancement. My creativity not only manifests in coding
      but also in my hobbies. I'm currently available for new opportunities in the IT field.</p>
  </section>

  <section class="contact">
    <h2>Get in Touch</h2>
    <p>Feel welcome to reach out to me via my LinkedIn or GitHub profiles, simply by clicking the icons below.</p>

    <p class="introduction-highlights-paragraph">

      <a href="https://www.linkedin.com/in/yumeangelica/" target="_blank" aria-label="Visit my LinkedIn profile">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original-wordmark.svg"
          alt="LinkedIn logo and link" />
      </a>

      <a href="https://github.com/yumeangelica" target="_blank" aria-label="Visit my GitHub profile">
        <img class="devicon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg" alt="GitHub logo and link" />
      </a>

    </p>

  </section>
</template>

<script>

</script>

<style>
  .devicon {
    max-width: 80px;
    margin-right: 25px;
    margin-bottom: 25px;
  }

  .profilepic {
    width: 100%;
    max-width: 300px;
    margin: 10px 0px 20px 35px;
  }

  /* Unordered heartlist */
  .heartlist ul {
    list-style: none;
  }

  /* Unordered heartlist - Position absolute and negative margin to stop heart bullet from interrupting the flow of the text */
  .heartlist ul li:before {
    content: "\2661";
    color: var(--kawaii-dark-pink);
    font-size: 24px;
    position: absolute;
    margin-left: -1em;
  }

  /* Unordered heartlist - Position relative, so heartlist is aligned properly */
  .heartlist li {
    font-size: 24px;
    position: relative;
    margin-top: 6px;
  }

  /* Unordered heartlist - smaller version */
  .heartlist-small ul {
    list-style: none;
  }

  .heartlist-small ul li:before {
    content: "\2661";
    color: var(--kawaii-dark-pink);
    font-size: 18px;
    position: absolute;
    margin-left: -1.1em;
  }

  .heartlist-small li {
    font-size: 18px;
    position: relative;
    padding: 1px 0px 1px 0px;
  }

  .introduction-highlights-paragraph {
    margin-bottom: 25px;
  }

  .other-dev-skills>span {
    display: inline-block;
    line-height: 1.5;
    font-size: 20px;
  }

  /* mobile mode rules */
  @media (max-width: 600px) {
    .devicon {
      max-width: 50px;
    }

    .other-dev-skills>span {
      font-size: 18px;
    }

    .profilepic {
      max-width: 200px;
    }
  }
</style>
