<template>
  <h1>Dive into My World of Code and Creativity</h1>

  <section class="intro">
    <img src="../assets/img/angelica_profilepic.jpeg" class="profilepic" alt="Profile Picture">
    <p>I'm a dedicated full-stack developer with a background in Business Administration, specializing in Marketing and Communications. Since 2020, I've
      been passionately studying programming and web development through various academic programs and courses.</p>
  </section>


  <section class="education">
    <div class="heartlistsmall">
      <h2>My developer journey</h2>
      <ul role="presentation">
        <li>Full-time role as a dedicated full-stack developer at Virittämö Helsinki.</li>
        <li>Bachelor of Science in Business Administration from the University of Vaasa.</li>
        <li>Pursued computer science as part of Helsinki University's DEFA project courses.</li>
        <li>Successfully completed the Fullstackopen course series, gaining valuable skills for a full-stack development career.</li>
        <li>Currently working toward a degree in Information and Communication Technology (engineer) at Metropolia.</li>
      </ul>
    </div>
  </section>


  <section class="commitment">
    <h2>My Commitment</h2>
    <p>My passion for programming runs deep, and I'm committed to continuous learning and skill improvement each day. I am currently available for hire
      in the IT-related field.</p>
  </section>

  <section class="contact">
    <h2>Get in Touch</h2>
    <p>Feel free to contact me through my LinkedIn or GitHub profiles.</p>
  </section>


  <div class="row">

    <div class="heartlistsmall col">
      <h2>Programming:</h2>
      <ul role="presentation">
        <li>MERN-stack (MongoDB, Express, React, Node)</li>
        <li>Vue.js (v3)</li>
        <li>JavaScript (ES6+)</li>
        <li>Python3</li>
        <li>SQLite</li>
        <li>CSS3 & HTML & Bootstrap</li>
        <li>Git & GitHub</li>
        <li>Docker</li>
        <li>CI/CD with GitHub Actions</li>
        <li>REST APIs</li>
        <li>Jest & Cypress for testing</li>
        <li>Agile Methodologies</li>
        <li>Figma</li>
      </ul>
    </div>


    <div class="heartlistsmall col">
      <h2> Digital marketing:</h2>
      <ul role="presentation">
        <li>Web accessibility</li>
        <li>SEO (search engine optimization)</li>
        <li>Content creation &amp; copywriting</li>
        <li>Social media marketing</li>
        <li>Photographing & editing (Photoshop)</li>
        <li>Marketing strategies</li>
        <li>MS Office 365</li>
      </ul>
    </div>

  </div>
</template>

<script>

</script>

<style>
  .profilepic {
    width: 100%;
    max-width: 350px;
    float: right;
    margin: 10px 0px 20px 35px;
  }


  /* Unordered heartlist for bio */

  .heartlist ul {
    list-style: none;
  }

  /* Unordered heartlist for bio - Position absolute and negative margin to stop heart bullet from interrupting the flow of the text */

  .heartlist ul li:before {
    content: "\2661";
    color: var(--kawaii-dark-pink);
    font-size: 24px;
    position: absolute;
    margin-left: -1em;
  }

  /* Unordered heartlist for bio  - Position relative, so heartlist is aligned properly */

  .heartlist li {
    font-size: 24px;
    position: relative;
    margin-top: 6px;
  }


  /* Unordered heartlist - smaller version */

  .heartlistsmall ul {
    list-style: none;
  }

  .heartlistsmall ul li:before {
    content: "\2661";
    color: var(--kawaii-dark-pink);
    font-size: 18px;
    position: absolute;
    margin-left: -1.1em;
  }

  .heartlistsmall li {
    font-size: 18px;
    position: relative;
    padding: 1px 0px 1px 0px;
  }
</style>
