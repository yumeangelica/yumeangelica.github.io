<template>
  <h1>{{ $t('home.title') }}</h1>

  <!-- Loading state -->
  <div v-if="loading" class="text-center" role="status" aria-live="polite">
    <p>{{ $t('home.loading') || 'Loading...' }}</p>
  </div>

  <!-- Error state -->
  <div v-else-if="fetchError" role="alert" class="error-message">
    <p>{{ $t('home.error') || 'Failed to load data. Please try again later.' }}</p>
  </div>

  <!-- Content -->
  <template v-else>
    <div class="row">
      <div class="col-lg-7">

        <p v-html="$t('home.introHtml')"></p>

        <h2 id="tech-stack">{{ $t('home.techStackTitle') }}</h2>
        <!-- Display technologies in categories -->
        <div class="tech-category" v-for="category in categorizedTechnologies" :key="category.name"
          :aria-labelledby="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">
          <h3 :id="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">{{ category.name }}</h3>
          <div class="introduction-highlights-paragraph" role="group">
            <span v-for="tech in category.techs" :key="tech.title" class="devicon-wrapper" tabindex="0" role="img" :aria-label="tech.title">
              <img class="devicon" :src="tech.url" :alt="tech.title" loading="lazy" aria-hidden="true" />
              <span class="devicon-tooltip" aria-hidden="true">{{ tech.title }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="col-md-auto">
        <img src="/assets/profile/angelica-profilepic.webp" class="img-responsive profilepic" :alt="$t('home.profilePicAlt')" fetchpriority="high"
          width="300" height="300">
      </div>
    </div>

    <section class="education">
      <div class="heartlist">
        <h2>{{ $t('home.journeyTitle') }}</h2>
        <ul>
          <li v-for="(item, index) in $tm('home.journeyItems')" :key="index">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="certifications">
      <div class="heartlist">
        <h2>{{ $t('home.certificationsTitle') }}</h2>
        <ul>
          <li v-for="(cert, index) in $tm('home.certifications')" :key="index">
            <a class="styled-link" :href="cert.url" target="_blank" rel="noopener noreferrer">
              {{ cert.text }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="interesting-fact">
      <h2>
        {{ $t('home.interestingFactTitleStart') }}
        <span class="tooltip-container" tabindex="0" :aria-label="$t('home.yumeAriaLabel')" @focus="isTooltipVisible = true"
          @blur="isTooltipVisible = false">
          {{ $t('home.yumeWord') }}
          <span class="tooltip-text" role="tooltip" aria-hidden="true" :class="{ 'visible': isTooltipVisible }">
            {{ $t('home.yumeTooltip') }}
          </span>
        </span>
      </h2>
      <p>{{ $t('home.interestingFactText') }}</p>
    </section>

    <section class="commitment">
      <h2>{{ $t('home.drivesTitle') }}</h2>
      <p v-html="$t('home.drivesTextHtml')"></p>

    </section>

    <section class="contact">
      <h2 id="contact">{{ $t('home.contactTitle') }}</h2>
      <p>{{ $t('home.contactEmail') }}</p>

      <p class="introduction-highlights-paragraph">
        <img class="contact-image" src="/assets/profile/angelica-contact.webp" :alt="$t('home.contactImageAlt')" loading="lazy" />
      </p>

      <p>{{ $t('home.contactSocial') }}</p>

      <p class="introduction-highlights-paragraph">
        <a href="https://www.linkedin.com/in/yumeangelica/" target="_blank" :aria-label="$t('home.linkedinAriaLabel')" rel="noopener">
          <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original-wordmark.svg"
            :alt="$t('home.linkedinAlt')" loading="lazy" />
        </a>

        <a href="https://github.com/yumeangelica" target="_blank" :aria-label="$t('home.githubAriaLabel')" rel="noopener">
          <img class="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg"
            :alt="$t('home.githubAlt')" loading="lazy" />
        </a>
      </p>
    </section>
  </template>
</template>

<script>
import { fetchData } from '../dataCache.js';

export default {
  name: 'PageHome',
  data() {
    return {
      categorizedTechnologies: [],
      isTooltipVisible: false,
      loading: true,
      fetchError: false
    };
  },
  mounted() {
    this.fetchTechnologies();
  },
  methods: {
    async fetchTechnologies() {
      try {
        const data = await fetchData();

        this.categorizedTechnologies = Object.freeze(
          data.technologies.map(group => Object.freeze({
            name: group.category,
            techs: Object.freeze(group.items)
          }))
        );
      } catch (error) {
        this.fetchError = true;
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Error message styling */
.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.text-highlight {
  color: var(--color-primary-dark);
  font-weight: bold;
}

/* Custom CSS tooltip for tech icons — faster hover response than native title attribute */
.devicon-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
}

.devicon {
  width: 65px;
  max-width: 65px;
  display: block;
  padding: 2px;
  border-radius: 5px;
}

.devicon-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-card-bg, #333);
  color: var(--color-text, #fff);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.15s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-bottom: 4px;
}

.devicon-wrapper:hover .devicon-tooltip,
.devicon-wrapper:focus .devicon-tooltip,
.devicon-wrapper:focus-within .devicon-tooltip {
  visibility: visible;
  opacity: 1;
}

.devicon-wrapper:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 6px;
}

.contact-icon {
  max-width: 80px;
  margin-right: 25px;
  margin-bottom: 15px;
  border-radius: 5px;
  transition: transform var(--transition-duration) ease;
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

@media (max-width: 991px) {
  .profilepic {
    margin: 10px auto;
    display: block;
  }
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
    width: 45px;
    max-width: 45px;
  }

  .devicon-wrapper {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .contact-icon {
    max-width: 55px;
  }

  .contact-image {
    max-width: 85%;
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
