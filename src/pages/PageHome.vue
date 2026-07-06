<template>
  <h1>{{ $t('intro.title') }}</h1>

  <!-- Loading state -->
  <div v-if="loading" class="text-center" role="status" aria-live="polite">
    <p>{{ $t('common.loading') }}</p>
  </div>

  <!-- Error state -->
  <div v-else-if="fetchError" role="alert" class="error-message">
    <p>{{ $t('common.error') }}</p>
  </div>

  <!-- Content -->
  <template v-else>
    <div class="row">
      <div class="col-lg-7">

        <p>
          <template v-for="(segment, index) in $tm('intro.segments')" :key="`intro-${index}`">
            <span v-if="segment.type === 'highlight'" class="text-highlight">{{ segment.text }}</span>
            <em v-else-if="segment.type === 'emphasis'">{{ segment.text }}</em>
            <template v-else>{{ segment.text }}</template>
          </template>
        </p>

        <h2 id="tech-stack">{{ $t('techStack.title') }}</h2>
        <!-- Display technologies in categories -->
        <div class="tech-category" v-for="category in categorizedTechnologies" :key="category.name"
          :aria-labelledby="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">
          <h3 :id="'category-' + category.name.toLowerCase().replace(/\s+/g, '-')">{{ category.name }}</h3>
          <div class="introduction-highlights-paragraph" role="group">
            <span v-for="tech in category.techs" :key="tech.title" class="devicon-wrapper" role="img" :aria-label="tech.title">
              <img class="devicon" :src="tech.url" :alt="tech.title" loading="lazy" aria-hidden="true" />
              <span class="devicon-tooltip" aria-hidden="true">{{ tech.title }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="col-md-auto profile-col">
        <img src="/assets/profile/angelica-profilepic.webp" class="img-responsive profilepic" :alt="$t('intro.profileImageAlt')" fetchpriority="high">
      </div>
    </div>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="education">
      <div class="heartlist">
        <h2>{{ $t('journey.title') }}</h2>
        <ul>
          <li v-for="(item, index) in $tm('journey.items')" :key="index">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="certifications">
      <div class="heartlist">
        <h2>{{ $t('certifications.title') }}</h2>
        <ul>
          <li v-for="(cert, index) in $tm('certifications.items')" :key="index">
            <a class="styled-link" :href="cert.url" target="_blank" rel="noopener noreferrer"
              :aria-label="$t('common.externalLinkAriaLabel', { label: cert.text })">
              {{ cert.text }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="interesting-fact section-wash">
      <h2>
        {{ $t('yume.titleStart') }}
        <span class="tooltip-container" tabindex="0" :aria-label="$t('yume.ariaLabel')" @focus="isTooltipVisible = true"
          @blur="isTooltipVisible = false">
          {{ $t('yume.word') }}
          <span class="tooltip-text" role="tooltip" aria-hidden="true" :class="{ 'visible': isTooltipVisible }">
            {{ $t('yume.tooltip') }}
          </span>
        </span>
      </h2>
      <p>{{ $t('yume.text') }}</p>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="commitment section-wash">
      <h2>{{ $t('drives.title') }}</h2>
      <p>
        <template v-for="(segment, index) in $tm('drives.segments')" :key="`drives-${index}`">
          <span v-if="segment.type === 'highlight'" class="text-highlight">{{ segment.text }}</span>
          <template v-else>{{ segment.text }}</template>
        </template>
      </p>

    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="contact section-wash">
      <h2 id="contact">{{ $t('contact.title') }}</h2>
      <p>{{ $t('contact.linkedinPrompt') }}</p>

      <p class="introduction-highlights-paragraph">
        <img class="contact-image" src="/assets/profile/angelica-contact.webp" :alt="$t('contact.imageAlt')" loading="lazy" />
      </p>

      <p>{{ $t('contact.githubPrompt') }}</p>

      <div class="contact-buttons">
        <a href="https://www.linkedin.com/in/yumeangelica/" class="contact-button" target="_blank"
          :aria-label="$t('common.externalLinkAriaLabel', { label: $t('contact.visitLinkedin') })" rel="noopener">
          <svg class="contact-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
          {{ $t('nav.linkedin') }}
        </a>

        <a href="https://github.com/yumeangelica" class="contact-button" target="_blank"
          :aria-label="$t('common.externalLinkAriaLabel', { label: $t('contact.visitGithub') })" rel="noopener">
          <svg class="contact-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3z" />
          </svg>
          {{ $t('nav.github') }}
        </a>
      </div>
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
            techs: Object.freeze(group.items.map(item => ({ ...item })))
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
.text-highlight {
  color: var(--color-primary-dark);
  font-weight: 600;
}

/* Custom CSS tooltip for tech icons — faster hover response than native title attribute */
.devicon-wrapper {
  position: relative;
  display: inline-block;
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  padding: 8px;
  transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
}

@media (hover: hover) and (pointer: fine) {
  .devicon-wrapper:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
  }
}

.devicon {
  width: 48px;
  max-width: 48px;
  display: block;
  border-radius: 5px;
}

.devicon-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-card-bg);
  color: var(--color-text);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  width: max-content;
  max-width: min(220px, calc(100vw - 32px));
  overflow-wrap: break-word;
  white-space: normal;
  pointer-events: none;
  transition: opacity 0.15s ease;
  box-shadow: var(--shadow-md);
  margin-bottom: 4px;
}

.devicon-wrapper:hover .devicon-tooltip {
  visibility: visible;
  opacity: 1;
}

.contact-image {
  max-width: 90%;
  width: 320px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* Social pill buttons: same visual language as project-card buttons */
.contact-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  min-width: 150px;
  padding: 10px 24px;
  color: var(--color-white);
  background-color: var(--color-button);
  border-radius: var(--radius-pill);
  text-decoration: none;
  font-weight: 600;
  line-height: 1.2;
  touch-action: manipulation;
  transition: background-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
}

.contact-button:hover {
  background-color: var(--color-button-hover);
  box-shadow: var(--shadow-md);
}

.contact-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  background-color: var(--color-button-hover);
}

.contact-button-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Photo column centers vertically against the intro text */
.profile-col {
  align-self: center;
}

/* Photo keeps its natural 4:5 proportions: soft rounded rectangle with a
   thin pink border — no crop, no circle */
.profilepic {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 10px 0 20px 35px;
  border: 2px solid var(--color-primary-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 991px) {
  .profilepic {
    max-width: 260px;
    margin: 15px auto 28px;
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
  font-size: clamp(0.95rem, 0.9rem + 0.3vw, 1.1rem);
  position: relative;
  padding: 3px 0;
}

.introduction-highlights-paragraph {
  margin-bottom: 20px;
}

.tech-category .introduction-highlights-paragraph {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
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
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  background-color: var(--color-background);
  box-shadow: var(--shadow-lg);
  max-width: min(280px, calc(100vw - 32px));
  overflow-wrap: break-word;
  transition: opacity 0.4s ease, visibility 0.4s ease;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 110%;
  transform: translateY(-50%);
  white-space: normal;
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
  transition: color var(--transition-fast) ease,
    border-bottom-color var(--transition-fast) ease;
}

.styled-link:hover {
  color: var(--color-primary-dark);
  border-bottom-color: transparent;
}

/* Mobile mode rules */
@media (max-width: 568px) {
  .devicon {
    width: 36px;
    max-width: 36px;
  }

  .devicon-wrapper {
    padding: 6px;
    border-radius: var(--radius-sm);
  }

  .tech-category .introduction-highlights-paragraph {
    gap: 10px;
  }

  .contact-image {
    max-width: 85%;
  }

  /* Full-width stacked buttons: easy thumb targets on phones */
  .contact-button {
    width: 100%;
    max-width: 320px;
  }

  .heartlist ul li:before {
    font-size: 0.95rem;
  }

  .profilepic {
    max-width: 220px;
  }

  .tooltip-text {
    font-size: 16px;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    left: auto;
    right: 0;
    bottom: 25px;
    transform: translateX(0);
  }

  .tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
}

/* Ensure tooltip is visible when focused via keyboard */
.tooltip-container:focus-visible .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
