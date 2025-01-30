<template>
  <h1>Dive into My World of Code and Creativity</h1>

  <div class="row">
    <div class="col-lg-7">
      <p>I'm a passionate <span class="text-highlight">full-stack developer</span> with a deep interest in <span
          class="text-highlight">cybersecurity</span>. My background in Business Administration, along with skills in <span
          class="text-highlight">digital marketing</span> and <span class="text-highlight">SEO</span>, provided a strong foundation for my programming
        journey, which I began independently in 2020. With a foundation in <span class="text-highlight">agile practices</span>, I concentrate on
        crafting <span class="text-highlight">accessible</span> & <span class="text-highlight">optimized</span> web solutions, and address complex
        challenges effectively. I also hold <span class="text-highlight">a degree in Information and Communications Technology</span>.</p>

      <h2>Main Languages & Frameworks</h2>
      <!-- Display technologies in categories -->
      <div class="tech-category" v-for="category in categorizedTechnologies" :key="category.name">
        <h3>{{ category.name }}</h3>
        <p class="introduction-highlights-paragraph">
          <img v-for="tech in category.techs" :key="tech.id" class="devicon" :src="tech.url" :alt="tech.title" />
        </p>
      </div>

    </div>

    <div class="col-md-auto">
      <img src="../assets/img/angelica-profilepic.webp" class="img-responsive profilepic" alt="Angelica's Profile Picture">
    </div>
  </div>

  <section class="education">
    <div class="heartlist">
      <h2>My developer journey</h2>
      <ul role="presentation">
        <li>Gained work experience as a software developer at Helsinki City, Virittämö.</li>
        <li>Bachelor of Science in Business Administration from the University of Vaasa.</li>
        <li>Studied computer science as part of the DEFA project courses at the University of Helsinki.</li>
        <li>Successfully completed the Full Stack Open course series, acquiring valuable skills for a full-stack development career.</li>
        <li>Earned a degree in Information and Communications Technology from Business College Helsinki.</li>
        <li>Continuously enhancing my programming skills and aiming to secure a position where I can contribute and grow as a developer.</li>
      </ul>
    </div>
  </section>

  <section class="interesting-fact">
    <h2>A bit about my <span class="tooltip-container">yume<span class="tooltip-text">"dream"</span></span></h2>
    <p>When not immersed in coding, I indulge in my love for producing music and exploring Japanese culture, which fuels my creativity and
      brings a unique perspective to my work in tech.</p>
  </section>

  <section class="commitment">
    <h2>My Commitment</h2>
    <p>With a deep-rooted passion for programming, I'm committed to continual learning and skill enhancement. My creativity not only manifests in
      coding
      but also in my hobbies. I'm currently available for new opportunities in the IT field.</p>
  </section>

  <section class="contact">
    <h2>Get in Touch</h2>
    <p>Feel welcome to reach out to me via mail</p>

    <p class="introduction-highlights-paragraph">
      <img class="contact-image" src="../assets/img/angelica-contact.webp" alt="Angelica's Contact Information" />
    </p>

    <p>
      or my LinkedIn or GitHub profiles, simply by clicking the icons below:
    </p>

    <p class="introduction-highlights-paragraph">
      <a href="https://www.linkedin.com/in/yumeangelica/" target="_blank" aria-label="Visit my LinkedIn profile">
        <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original-wordmark.svg"
          alt="LinkedIn logo and link" />
      </a>

      <a href="https://github.com/yumeangelica" target="_blank" aria-label="Visit my GitHub profile">
        <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg"
          alt="GitHub logo and link" />
      </a>
    </p>

  </section>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const technologies = ref([]);
    const categories = ref([]);
    const categorizedTechnologies = ref([]);
    const dataURL = '../data.json';

    onMounted(async () => {
      try {
        const response = await fetch(dataURL);
        const data = await response.json();
        technologies.value = data.technologies; // Assign fetched data to variables
        categories.value = data.techCategories;
        categorizedTechnologies.value = categories.value.map(category => ({ // Map through categories and assign technologies to each category
          name: category.name,
          techs: technologies.value.filter(tech => category.technologies.includes(tech.title))
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    return { categorizedTechnologies };
  }
};

</script>

<style scoped>
.text-highlight {
  color: var(--color-primary-dark);
  font-weight: bold;
}

.devicon {
  max-width: 70px;
  margin-right: 15px;
  margin-bottom: 15px;
  padding: 2px;
  border-radius: 5px;
}

.contact-icon {
  max-width: 80px;
  margin-right: 25px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.contact-image {
  max-width: 90%;
  width: 320px;
}

.contact-icon:hover {
  transform: scale(1.05);
  cursor: pointer;
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

.heartlist ul li:before {
  content: "\2661";
  color: var(--color-primary);
  font-size: 1.1rem;
  position: absolute;
  margin-left: -1.1em;
}

.heartlist li {
  font-size: 1.1rem;
  position: relative;
  padding: 1px 0px 1px 0px;
}

.introduction-highlights-paragraph {
  margin-bottom: 20px;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-bottom: 1px dashed var(--color-primary);
  padding-bottom: 2px;
}

.tooltip-text {
  font-size: 22px;
  visibility: hidden;
  opacity: 0;
  width: auto;
  color: var(--color-primary);
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: opacity 0.4s ease, visibility 0.4s ease;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 110%;
  transform: translateY(-50%);
  white-space: nowrap;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Mobile mode rules */
@media (max-width: 568px) {
  .devicon {
    max-width: 45px;
    margin-right: 10px;
  }

  .contact-icon {
    max-width: 55px;
  }

  .heartlist li,
  p {
    font-size: 0.9rem;
  }

  .heartlist ul li:before {
    font-size: 0.9rem;
  }

  .profilepic {
    max-width: 200px;
    margin: 10px auto;
    display: block;
  }

  .tooltip-text {
    font-size: 16px;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    left: auto;
    right: -45px;
    bottom: 25px;
    transform: translateX(0%);
  }

  .tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
}
</style>
