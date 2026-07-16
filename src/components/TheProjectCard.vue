<template>
  <article class="project-card">
    <div class="project-image-container">
      <img :src="project.imageURL" :alt="projectTitle" :width="project.imageWidth" :height="project.imageHeight" loading="lazy" />
      <span v-if="project.type" class="project-type-badge">{{ $t(`projects.filters.types.${project.type}.label`) }}</span>
    </div>

    <div class="project-details">
      <h3>{{ projectTitle }}</h3>
      <p v-if="summary" class="project-summary">{{ summary }}</p>
      <div class="used-technologies" role="group" :aria-label="$t('projectCard.technologiesLabel')">
        <template v-for="techName in visibleTechs" :key="techName">
          <span v-if="getTechIconUrl(techName)" class="tech-chip" :title="techName">
            <img class="small-devicon" :src="getTechIconUrl(techName)" :alt="techName" loading="lazy" />
          </span>
        </template>
        <span v-if="extraTechs.length" class="tech-chip tech-chip-more" :title="extraTechs.join(', ')">
          <span aria-hidden="true">+{{ extraTechs.length }}</span>
          <span class="visually-hidden">{{ extraTechs.join(', ') }}</span>
        </span>
      </div>
      <ul v-if="highlights.length" class="project-highlights">
        <li v-for="info in highlights" :key="info" class="additional-info">
          {{ info }}
        </li>
      </ul>
      <div class="buttons">
        <a v-for="link in links" :key="link.text" :href="link.url" class="project-button" target="_blank" rel="noopener"
          :aria-label="$t('projectCard.linkAriaLabel', { linkText: link.text, projectTitle: projectTitle })">
          {{ link.text }}
        </a>
      </div>
    </div>
  </article>
</template>


<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { ProjectCardProject, Technology } from '../types/portfolio'

// Icons beyond this count collapse into a "+N" chip so long stacks
// (e.g. 16 technologies) don't overwhelm the card.
const MAX_VISIBLE_TECH_ICONS = 8

export default defineComponent({
  name: 'TheProjectCard',
  props: {
    project: {
      type: Object as PropType<ProjectCardProject>,
      required: true,
    },
    technologies: {
      type: Array as PropType<readonly Technology[]>,
      required: true,
    },
  },
  computed: {
    projectTitle() {
      return this.project?.title || ''
    },
    additionalInfo() {
      return Array.isArray(this.project?.additionalInfo)
        ? this.project.additionalInfo
        : []
    },
    // Content convention in data.json: first additionalInfo item is a
    // one-sentence summary, the rest are skill highlights.
    summary() {
      return this.additionalInfo[0] || ''
    },
    highlights() {
      return this.additionalInfo.slice(1)
    },
    links() {
      return Array.isArray(this.project?.links) ? this.project.links : []
    },
    technologyTitles() {
      return Array.isArray(this.project?.technologyTitles)
        ? this.project.technologyTitles
        : []
    },
    visibleTechs() {
      return this.technologyTitles.slice(0, MAX_VISIBLE_TECH_ICONS)
    },
    extraTechs() {
      return this.technologyTitles.slice(MAX_VISIBLE_TECH_ICONS)
    },
  },
  methods: {
    /**
     * @param {string} techName
     */
    getTechIconUrl(techName: string): string {
      const technologies = Array.isArray(this.technologies)
        ? this.technologies
        : []
      const tech = technologies.find((t) => t.title === techName)
      return tech ? tech.url : ''
    },
  },
})
</script>


<style scoped>
/* Tech icons sit in small soft chips — same visual language as the
   home-page tech chips, scaled down for cards */
.tech-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  padding: 5px;
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-sm);
}

.small-devicon {
  max-width: 20px;
  max-height: 20px;
  border-radius: 3px;
  display: block;
}

/* Overflow chip: "+N" for technologies beyond the visible eight */
.tech-chip-more {
  background-color: var(--color-primary-light);
  /* darkest token: AA contrast for small bold text on the pink chip */
  color: var(--color-primary-dark);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 9px;
  cursor: default;
}

.used-technologies {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

/* Lead sentence: what the project is, at a glance */
.project-summary {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--color-text);
  margin-bottom: 14px;
}

/* Skill highlights with small ♡ bullets */
.project-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: grid;
  gap: 6px;
}

.additional-info {
  position: relative;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--color-text);
  padding-left: 1.5em;
  overflow-wrap: break-word;
}

.additional-info::before {
  content: '\2661';
  color: var(--color-primary);
  position: absolute;
  left: 0.15em;
  top: 0;
  font-size: 0.95em;
}

/* Project type as a small pill over the image corner */
.project-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 11px;
  border-radius: var(--radius-pill);
  /* whisper-pink surface at high alpha so the label stays readable over any image */
  background-color: rgba(253, 244, 251, 0.92);
  color: var(--color-card-heading);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  backdrop-filter: blur(4px);
  box-shadow: var(--shadow-sm);
}

.project-card {
  /* Whisper pink melting into whisper lilac: airy but never pure white,
     so the surface stays inside the palette */
  background: linear-gradient(180deg, var(--color-surface-pink) 0%, var(--color-surface-lilac) 100%);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 10px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;
  border: 1px solid var(--color-border-soft);
  flex: 1 1 calc(50% - 20px);
  max-width: 500px;
}

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-light);
  }

  /* Subtle zoom on the cover image together with the card lift */
  .project-card:hover .project-image-container img {
    transform: scale(1.03);
  }
}

.project-image-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  flex-shrink: 0;
}

.project-image-container img {
  /* Responsive image. The intrinsic width/height attributes (from data.json)
     let the browser reserve the correct space per image before load to avoid
     layout shift (CLS); width:100% + height:auto keep it fluid without
     distorting the aspect ratio. */
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0;
  transition: transform var(--transition-medium) ease;
}

.project-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 18px 20px 20px;
}

.project-details h3 {
  /* Mauve heading token: meets AA contrast on the card surface
     while staying softer than the near-black primary-dark. */
  color: var(--color-card-heading);
  margin-bottom: 8px;
  font-size: 1.25rem;
  padding: 0;
  overflow-wrap: break-word;
}

.buttons {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  padding-top: 14px;
  /* Soft hairline separates the action row from the content */
  border-top: 1px solid var(--color-border-soft);
}

.project-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  min-height: 44px;
  max-width: 100%;
  color: var(--color-white);
  background-color: var(--color-button);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  touch-action: manipulation;
  transition: background-color var(--transition-fast) ease, color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
  font-size: 0.95rem;
}

/* External-link arrow: pseudo-content with empty alt so screen readers
   skip it (they already get the "opens in new tab" aria-label) */
.project-button::after {
  content: '\2197' / '';
  font-size: 0.85em;
  margin-left: 6px;
}

.project-button:hover {
  background-color: var(--color-button-hover);
  color: var(--color-white);
  box-shadow: var(--shadow-md);
}

/* Add focus styles for better keyboard accessibility */
.project-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  background-color: var(--color-button-hover);
}

@media (min-width: 1280px) {
  .project-card {
    max-width: 540px;
  }
}

@media (max-width: 568px) {
  .project-details {
    padding: 16px;
  }

  .tech-chip {
    min-width: 30px;
    min-height: 30px;
    padding: 4px;
  }

  .small-devicon {
    max-width: 18px;
    max-height: 18px;
  }

  .project-card {
    width: 100%;
    margin: 10px 0;
  }

  .buttons {
    gap: 8px;
    padding-top: 12px;
  }

  /* One comfortable full-width action per row on phones */
  .project-button {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>
