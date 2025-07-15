<template>
  <h1>Step into My World of Code & Creativity</h1>

  <div class="row">
    <div class="col-lg-7">

      <p> I'm a <span class="text-highlight">full-stack developer</span> who loves building things that are both beautiful and secure. With a
        background in Business Administration and <span class="text-highlight">digital marketing</span>, I approach software development creatively
        and strategically. Since 2020, I've specialized in creating <span class="text-highlight">accessible</span> and <span
          class="text-highlight">optimized</span> web solutions, solving real-world challenges in dynamic <span class="text-highlight">agile
          environments</span>. I hold a degree in <span class="text-highlight">Information and Communications Technology</span> and thrive in bridging
        technology with user-friendly experiences. </p>


      <h2 id="tech-stack">Favorite Tech Stack & Tools</h2>
      <!-- Display technologies in categories -->
      <div class="tech-category" v-for="category in categorizedTechnologies" :key="category.name"
        :aria-labelledby="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">
        <h3 :id="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">{{ category.name }}</h3>
        <div class="introduction-highlights-paragraph" role="group">
          <img v-for="tech in category.techs" :key="tech.id" class="devicon" :src="tech.url" :alt="tech.title" :title="tech.title" loading="lazy" />
        </div>
      </div>
    </div>

    <div class="col-md-auto">
      <img src="/assets/img/angelica-profilepic.webp" class="img-responsive profilepic" alt="Angelica's Profile Picture" loading="lazy">
    </div>
  </div>

  <section class="education">
    <div class="heartlist">
      <h2>My Developer Journey</h2>
      <ul role="presentation">
        <li>Currently working as a Software Developer at OP Financial Group, focusing on creating accessible frontend solutions using React,
          TypeScript, SCSS, and design systems in an international, highly regulated environment. Occasionally, I also dive into backend (Java Spring
          Boot) and cloud development.</li>
        <li>Previously, I was a full-stack developer at the City of Helsinki (Virittämö), primarily working on backend solutions with the MERN stack.
        </li>
        <li>Years of building personal projects driven by curiosity and a never-ending passion for learning.</li>
        <li>Bachelor's degree in Business Administration from the University of Vaasa (graduated with excellence).</li>
        <li>Completed over 180 ECTS credits in Information Technology at Metropolia University of Applied Sciences and other higher education
          institutions.</li>
        <li>Finished the Full Stack Open course series at the University of Helsinki with excellent grades and participated in the DEFA project.</li>
        <li>Additional studies in DevOps with Docker, Cyber Security, and Python Programming at the University of Helsinki.</li>
        <li>ICT degree from Business College Helsinki, graduating in April 2024 with a GPA of 4.95/5.</li>
        <li>A versatile skill set blending technical expertise with strong social and business skills.</li>
      </ul>
    </div>
  </section>

  <section class="certifications">
    <div class="heartlist">
      <h2>Professional Certifications</h2>
      <ul role="presentation">
        <li>
          <a class="styled-link"
            href="https://learn.microsoft.com/api/credentials/share/en-us/yumeangelica/5AC06C18FC8D561A?sharingId=34D975BF021B8BDF" target="_blank"
            rel="noopener noreferrer">
            Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)
          </a>
        </li>
      </ul>
    </div>
  </section>

  <section class="interesting-fact">
    <h2>
      A bit about my
      <span class="tooltip-container" tabindex="0" role="tooltip" aria-label='yume, meaning "dream"' @focus="isTooltipVisible = true"
        @blur="isTooltipVisible = false">
        yume
        <span class="tooltip-text" aria-hidden="true" :class="{ 'visible': isTooltipVisible }">
          "dream"
        </span>
      </span>
    </h2>
    <p> Outside of coding, I'm passionate about producing music and exploring Japanese culture, both of which inspire my creativity and bring a unique
      perspective to my work in tech. </p>
  </section>

  <section class="commitment">
    <h2>Code with Passion</h2>
    <p> I'm deeply passionate about programming and constantly strive to learn and grow. My creativity isn't just limited to coding, it’s enhanced by
      my hobbies, making me a more innovative problem solver. Right now, I'm open to new opportunities in the tech field, so let’s connect! </p>
  </section>

  <section class="contact">
    <h2 id="contact">Get in Touch</h2>
    <p>I'd love to hear from you — feel free to drop me an email.</p>

    <p class="introduction-highlights-paragraph">
      <img class="contact-image" src="/assets/img/angelica-contact.webp" alt="Angelica's Contact Information" loading="lazy" />
    </p>

    <p>
      You can also find me on LinkedIn or GitHub by clicking the icons below.
    </p>

    <p class="introduction-highlights-paragraph">
      <a href="https://www.linkedin.com/in/yumeangelica/" target="_blank" aria-label="Visit my LinkedIn profile" rel="noopener">
        <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original-wordmark.svg"
          alt="LinkedIn logo and link" loading="lazy" />
      </a>

      <a href="https://github.com/yumeangelica" target="_blank" aria-label="Visit my GitHub profile" rel="noopener">
        <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg"
          alt="GitHub logo and link" loading="lazy" />
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
    const isTooltipVisible = ref(false);
    const dataURL = '../data.json';

    onMounted(async () => {
      try {
        const response = await fetch(dataURL);
        const data = await response.json();
        technologies.value = data.technologies;
        categories.value = data.techCategories;
        categorizedTechnologies.value = categories.value.map(category => ({
          name: category.name,
          techs: technologies.value.filter(tech => category.technologies.includes(tech.title))
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    return {
      categorizedTechnologies,
      isTooltipVisible
    };
  }
};
</script>

<style scoped>
.text-highlight {
  color: var(--color-primary-dark);
  font-weight: bold;
}

.devicon {
  max-width: 65px;
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

.tooltip-text.visible {
  visibility: visible;
  opacity: 1;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Special link decoration and animation */
.styled-link {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-primary);
  transition: color var(--transition-duration) ease,
    border-bottom-color var(--transition-duration) ease;
}

.styled-link:hover {
  color: var(--color-primary-dark);
  border-bottom-color: transparent;
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

/* Improve focus visibility for links */
a:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  transform: scale(1.05);
}

/* Ensure tooltip is visible when focused via keyboard */
.tooltip-container:focus-visible .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
