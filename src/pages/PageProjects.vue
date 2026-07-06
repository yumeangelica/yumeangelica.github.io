<template>
  <div class="projects-page">
    <!-- Page title -->
    <h1 id="projects-overview" class="text-center">{{ $t('projects.title') }}</h1>

    <!-- Filter functionality -->
    <div class="filter-container">
      <!-- Unified filter row: two centered rows, always visible on all devices -->
      <div class="filters-row">
        <div class="filter-group">
          <span class="filter-label">{{ $t('projects.filters.typeLabel') }}</span>
          <div class="filter-row-inner filter-row-type" role="group" :aria-label="$t('projects.filters.typeGroupAriaLabel')">
            <button type="button" @click="toggleTypeFilter(null)" class="filter-btn filter-type" :class="{ active: selectedTypes.length === 0 }"
              :aria-label="$t('projects.filters.allTypesAriaLabel')">
              {{ $t('projects.filters.allLabel') }}
            </button>
            <button type="button" v-for="type in typeFilters" :key="type" @click="toggleTypeFilter(type)" class="filter-btn filter-type"
              :class="{ active: selectedTypes.includes(type) }" :disabled="!isTypeTechComboAvailable(type, selectedTech)"
              :aria-label="$t(`projects.filters.types.${type}.ariaLabel`)">
              {{ $t(`projects.filters.types.${type}.label`) }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <button type="button" class="filter-panel-toggle" @click="isTechFiltersOpen = !isTechFiltersOpen" :aria-expanded="isTechFiltersOpen"
            aria-controls="technology-filters" :aria-label="$t('projects.filters.techToggleAriaLabel', { count: selectedTech.length })">
            <span>{{ $t('projects.filters.techLabel') }}</span>
            <span v-if="selectedTech.length > 0" class="filter-count" aria-hidden="true">{{ selectedTech.length }}</span>
            <span class="filter-chevron" :class="{ open: isTechFiltersOpen }" aria-hidden="true">⌄</span>
          </button>
          <div v-show="isTechFiltersOpen" id="technology-filters" class="filter-row-inner filter-row-tech" role="group"
            :aria-label="$t('projects.filters.techGroupAriaLabel')">
            <button type="button" @click="toggleTechFilter(null)" class="filter-btn tech-filter-btn tech-filter-all" :class="{ active: selectedTech.length === 0 }"
              :aria-label="$t('projects.filters.allTechAriaLabel')">
              <span>{{ $t('projects.filters.allLabel') }}</span>
            </button>
            <button type="button" v-for="tech in popularTechnologies" :key="tech.title" @click="toggleTechFilter(tech.title)" class="filter-btn tech-filter-btn"
              :class="{ active: selectedTech.includes(tech.title) }" :disabled="!isTechTypeComboAvailable(tech.title, selectedTypes)"
              :aria-label="$t('projects.filters.techAriaLabel', { title: tech.title })">
              <img :src="tech.url" :alt="tech.title" :title="tech.title" class="tech-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter results count for screen readers -->
    <div v-if="!loading && !fetchError" class="visually-hidden" aria-live="polite" aria-atomic="true">
      {{ resultsAnnouncement }}
    </div>

    <!-- Loading and error indicators -->
    <div v-if="loading" class="text-center" role="status" aria-live="polite">
      <p>{{ $t('projects.loading') }}</p>
    </div>

    <div v-if="fetchError" role="alert" class="error-message">
      <p>{{ $t('projects.error') }}</p>
    </div>

    <!-- Project sections, one per type that currently has matching projects -->
    <section v-for="section in visibleSections" :key="section.type" :aria-labelledby="section.id">
      <h2 :id="section.id" class="text-center">{{ $t(`projects.sections.${section.type}.title`) }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in section.projects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Floating navigation - appears when scrolled down -->
    <Transition name="fade">
      <div v-if="showFloatingNav" class="floating-nav" role="navigation" :aria-label="$t('projects.floatingNav.ariaLabel')"
        @keydown.esc="isFloatingMenuOpen = false">
        <button type="button" @click="toggleFloatingMenu" class="floating-nav-toggle" :aria-expanded="isFloatingMenuOpen"
          :aria-label="$t('projects.floatingNav.toggleAriaLabel')">
          <span class="nav-icon" :class="{ rotated: isFloatingMenuOpen }">☰</span>
        </button>

        <Transition name="slide-up">
          <div v-if="isFloatingMenuOpen" class="floating-nav-menu">
            <button type="button" @click="scrollToSection('back-to-top')" class="floating-nav-button">
              {{ $t('backToTop.title') }}
            </button>
            <button type="button" v-for="type in floatingNavTypes" :key="type" @click="scrollToSection(`${type}-projects`)"
              class="floating-nav-button" :class="{ disabled: !hasVisibleProjects(type) }" :disabled="!hasVisibleProjects(type)">
              {{ $t(`projects.sections.${type}.navLabel`) }}
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import TheProjectCard from '../components/TheProjectCard.vue';
import { fetchData } from '../dataCache.js';
import { scrollBehavior } from '../scroll';

// Project types shown as selectable type-filter buttons, in display order.
const TYPE_FILTERS = ['frontend', 'backend', 'fullstack', 'cli'];
// Project sections in the order they are rendered on the page.
const SECTION_TYPES = ['main', 'fullstack', 'frontend', 'backend', 'cli'];
// Section links in the floating quick-navigation menu, in menu order.
const FLOATING_NAV_TYPES = ['main', 'frontend', 'backend', 'fullstack', 'cli'];

export default {
  name: 'PageProjects',
  data() {
    return {
      allProjects: [],
      frontendProjects: [],
      backendProjects: [],
      fullstackProjects: [],
      cliProjects: [],
      mainProjects: [],
      technologies: [],
      selectedTech: [], // For technology filtering, multi-select, all by default
      selectedTypes: [], // For type filtering, single-select, all by default
      fetchError: false, // If data fetching fails, show error message
      loading: true, // For accessibility, show loading message while fetching data
      showFloatingNav: false, // Show floating nav when scrolled
      isFloatingMenuOpen: false, // Toggle for floating menu
      isTechFiltersOpen: false, // Mobile disclosure for the technology filter grid
      scrollTimeout: null, // For throttling scroll events
    }
  },
  components: {
    TheProjectCard,
  },
  computed: {
    popularTechnologies() {
      // Main programming languages and frameworks to show in the filter
      const techNames = [
        'Vue.js',      // Frontend #1
        'React',       // Frontend #2
        'Python',      // Backend language #1
        'JavaScript',  // Frontend / Backend language
        'TypeScript',  // Type-safe JavaScript
        'Node.js',     // Backend runtime
        'Express.js',  // Backend framework
        'Django',      // Python framework
        'MongoDB',     // Database #1
        'SQLite',      // Database #2
        'Docker',      // DevOps/Deployment
        'PHP',          // Backend language #2
        'Azure',        // Cloud platform
        'Raspberry Pi', // Hardware projects
      ];
      const technologies = Array.isArray(this.technologies) ? this.technologies : [];
      return technologies.filter(tech => techNames.includes(tech.title));
    },
    typeFilters() {
      return TYPE_FILTERS;
    },
    floatingNavTypes() {
      return FLOATING_NAV_TYPES;
    },
    // Projects for each section, filtered by the active type/tech selection.
    filteredProjectsByType() {
      return {
        main: this.filterProjects(this.mainProjects),
        fullstack: this.filterProjects(this.fullstackProjects),
        frontend: this.filterProjects(this.frontendProjects),
        backend: this.filterProjects(this.backendProjects),
        cli: this.filterProjects(this.cliProjects),
      };
    },
    // Sections with at least one matching project, in render order.
    visibleSections() {
      return SECTION_TYPES
        .map(type => ({ type, id: `${type}-projects`, projects: this.filteredProjectsByType[type] }))
        .filter(section => section.projects.length > 0);
    },
    totalFilteredProjects() {
      return Object.values(this.filteredProjectsByType).reduce((total, list) => total + list.length, 0);
    },
    resultsAnnouncement() {
      return this.totalFilteredProjects === 1
        ? this.$t('projects.filters.resultsFoundOne')
        : this.$t('projects.filters.resultsFound', { count: this.totalFilteredProjects });
    },
  },
  methods: {
    // Whether a given section type currently has any matching project.
    hasVisibleProjects(type) {
      return this.filteredProjectsByType[type].length > 0;
    },
    // Check if any project exists for the given type and selected techs
    isTypeTechComboAvailable(type, techArr) {
      const projects = Array.isArray(this.allProjects) ? this.allProjects : [];
      const selectedTech = Array.isArray(techArr) ? techArr : [];
      // If no tech selected, just check for type
      if (selectedTech.length === 0) {
        return projects.some(p => p.type === type);
      }
      // If techArr contains more than one tech, only allow if a project has ALL those techs
      // But if no project has all selected techs, disable
      return projects.some(p => p.type === type && selectedTech.length > 0 && selectedTech.every(t => p.technologyTitles?.includes(t)));
    },
    // Check if any project exists for the given tech and selected type
    isTechTypeComboAvailable(tech, typeArr) {
      const projects = Array.isArray(this.allProjects) ? this.allProjects : [];
      const selectedTypes = Array.isArray(typeArr) ? typeArr : [];
      // If tech is already selected, always allow to deselect
      if (this.selectedTech.includes(tech)) return true;

      // If no type selected, check if any project has all selected techs + this tech
      if (selectedTypes.length === 0) {
        const nextTechs = [...this.selectedTech, tech];
        return projects.some(p => nextTechs.every(t => p.technologyTitles?.includes(t)));
      }
      // If type selected, check if any project matches type and all selected techs + this tech
      const nextTechs = [...this.selectedTech, tech];
      return projects.some(p => selectedTypes.includes(p.type) && nextTechs.every(t => p.technologyTitles?.includes(t)));
    },
    filterProjects(projects) {
      const sourceProjects = Array.isArray(projects) ? projects : [];
      const selectedTypes = Array.isArray(this.selectedTypes) ? this.selectedTypes : [];
      const selectedTech = Array.isArray(this.selectedTech) ? this.selectedTech : [];
      // Filter by type first
      let filtered = sourceProjects;
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(project => selectedTypes.includes(project.type));
      }
      // Then filter by tech
      if (selectedTech.length === 0) return filtered;
      return filtered.filter(project => {
        if (!project.technologyTitles) return false;
        return selectedTech.every(tech => project.technologyTitles.includes(tech));
      });
    },
    toggleTechFilter(techName) {
      if (techName === null) {
        this.selectedTech = [];
        return;
      }
      if (this.selectedTech.includes(techName)) {
        // If only one tech is selected and it's this one, deselect to All
        if (this.selectedTech.length === 1) {
          this.selectedTech = [];
        } else {
          this.selectedTech = this.selectedTech.filter(t => t !== techName);
        }
      } else {
        this.selectedTech = [...this.selectedTech, techName];
      }
    },
    toggleTypeFilter(typeName) {
      if (typeName === null) {
        this.selectedTypes = [];
        return;
      }
      if (this.selectedTypes.length === 1 && this.selectedTypes[0] === typeName) {
        // If only one type is selected and it's this one, deselect to All
        this.selectedTypes = [];
        return;
      }
      this.selectedTypes = [typeName];
    },
    scrollToSection(sectionId) {
      // Special case for back to top - scroll to very top of page
      if (sectionId === 'back-to-top') {
        window.scrollTo({
          top: 0,
          behavior: scrollBehavior()
        });
        this.isFloatingMenuOpen = false; // Close menu after navigation
        return;
      }

      // Regular section scrolling
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        this.isFloatingMenuOpen = false; // Close menu after navigation
      }
    },
    toggleFloatingMenu() {
      this.isFloatingMenuOpen = !this.isFloatingMenuOpen;
    },
    // Throttled scroll handler for better performance
    handleScroll() {
      if (this.scrollTimeout) return;

      this.scrollTimeout = setTimeout(() => {
        // Show floating nav when scrolled down 200px
        this.showFloatingNav = window.scrollY > 200;

        // Close floating menu when scrolling
        if (this.isFloatingMenuOpen) {
          this.isFloatingMenuOpen = false;
        }

        this.scrollTimeout = null;
      }, 16); // ~60fps throttling
    }
  },
  async created() { // When site is loaded, fetch data from data.json
    try {
      const data = await fetchData();
      const projects = Array.isArray(data?.projects) ? data.projects : [];
      const technologies = Array.isArray(data?.technologies) ? data.technologies : [];

      this.technologies = technologies.flatMap(group => Array.isArray(group?.items) ? group.items : []);
      this.allProjects = projects;
      this.mainProjects = projects.filter(p => p.isMain === true);
      this.frontendProjects = projects.filter(p => p.type === 'frontend' && !p.isMain);
      this.backendProjects = projects.filter(p => p.type === 'backend' && !p.isMain);
      this.fullstackProjects = projects.filter(p => p.type === 'fullstack' && !p.isMain);
      this.cliProjects = projects.filter(p => p.type === 'cli' && !p.isMain);
      this.loading = false;
    } catch (error) {
      this.fetchError = true;
      this.loading = false;
      console.error('Error fetching data:', error);
    }
  },
  mounted() {
    // Add scroll listener for floating navigation
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  },
  beforeUnmount() {
    // Clean up scroll listener and timeout
    window.removeEventListener('scroll', this.handleScroll);
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

</script>



<style scoped>
/* Main page container */
.projects-page {
  padding-bottom: 50px;
}

/* Mobile-first filters: wrapping pill rows that fit any viewport width;
   the technology menu is a disclosure panel on every screen size */
.filter-container {
  max-width: 780px;
  margin: 0 auto 32px;
  padding: 0 8px;
}

.filters-row {
  display: grid;
  gap: 10px;
}

.filter-group {
  display: grid;
  justify-items: center;
  gap: 5px;
}

.filter-label {
  color: var(--color-primary-dark);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
}

.filter-panel-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: min(100%, 320px);
  min-height: 44px;
  padding: 8px 14px;
  color: var(--color-primary-dark);
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.62), rgba(253, 244, 251, 0.96)),
    var(--color-surface-pink);
  border: 1.5px solid var(--color-primary-light);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
}

.filter-panel-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 7px;
  color: var(--color-white);
  background-color: var(--color-primary);
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1;
}

.filter-chevron {
  margin-left: auto;
  color: var(--color-primary);
  font-size: 1rem;
  line-height: 1;
  transition: transform var(--transition-fast) ease;
}

.filter-chevron.open {
  transform: rotate(180deg);
}

.filter-row-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 7px;
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.58), rgba(253, 244, 251, 0.94)),
    var(--color-surface-pink);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* Filter-btn for all filter buttons */
.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: var(--radius-pill);
  padding: 6px 12px;
  min-width: 44px;
  min-height: 44px;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background-color var(--transition-fast) ease,
    border-color var(--transition-fast) ease,
    box-shadow var(--transition-fast) ease,
    color var(--transition-fast) ease,
    filter var(--transition-fast) ease,
    opacity var(--transition-fast) ease;
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border: 1.5px solid var(--color-primary-light);
  opacity: 0.95;
}

@media (hover: hover) and (pointer: fine) {
  .filter-btn:not(:disabled):not(.active):hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  opacity: 1;
}

.filter-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.filter-btn.disabled,
.filter-btn:disabled {
  opacity: 0.35 !important;
  color: var(--color-text) !important;
  background-color: var(--color-card-bg) !important;
  border-color: var(--color-primary-light) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  filter: grayscale(1) brightness(1.2);
}

.tech-filter-btn {
  width: 44px;
  padding: 0;
}

.tech-filter-all {
  width: auto;
  padding: 0 14px;
}

.tech-icon {
  width: 22px;
  height: 22px;
  border-radius: 3px;
}

/* Larger screens: panels hug their content instead of stretching full width */
@media (min-width: 769px) {
  .filter-container {
    padding: 0 10px;
  }

  .filters-row {
    gap: 12px;
  }

  .filter-group {
    gap: 6px;
  }

  .filter-row-inner {
    gap: 7px;
    width: fit-content;
    max-width: 100%;
    padding: 8px;
  }

  .filter-row-tech {
    width: min(100%, 650px);
  }
}

/* Section headings: small centered hairline accent, same visual language
   as the home-page dividers */
section h2 {
  position: relative;
  padding-bottom: 18px;
}

section h2::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  width: min(140px, 40%);
  height: 2px;
  border-radius: var(--radius-pill);
  background: linear-gradient(to right, transparent, var(--color-primary-light), transparent);
}

/* Project containers */
.projects-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(16px, 2.5vw, 24px);
  align-items: stretch;
  padding: 10px;
  margin-bottom: 30px;
}


/* Mobile and small tablet mode */
@media (max-width: 768px) {
  .projects-container {
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
}

/* Floating navigation styles */
.floating-nav {
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.floating-nav-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: var(--shadow-md);
  transition:
    background-color var(--transition-fast) ease,
    box-shadow var(--transition-fast) ease,
    transform var(--transition-fast) ease;
}

.floating-nav-toggle:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.floating-nav-toggle:focus-visible {
  outline: 2px solid var(--color-white);
  outline-offset: 2px;
}

.nav-icon {
  transition: transform var(--transition-duration) ease;
}

.nav-icon.rotated {
  transform: rotate(90deg);
}

.floating-nav-menu {
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: var(--color-surface-lilac);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
  border: 1px solid var(--color-border-soft);
}

.floating-nav-button {
  padding: 8px 12px;
  background-color: transparent;
  color: var(--color-text);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition:
    background-color var(--transition-fast) ease,
    color var(--transition-fast) ease;
  white-space: nowrap;
}

.floating-nav-button:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.floating-nav-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

/* Mobile adjustments for floating nav */
@media (max-width: 768px) {
  .floating-nav {
    bottom: 80px;
    right: 20px;
  }

  .floating-nav-toggle {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }

  .floating-nav-menu {
    bottom: 55px;
    min-width: 100px;
    padding: 8px;
  }

  .floating-nav-button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 568px) {
  .floating-nav {
    bottom: 74px;
    right: 10px;
  }

  .floating-nav-toggle {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }

  .floating-nav-menu {
    bottom: 54px;
    min-width: 90px;
    padding: 6px;
  }

  .floating-nav-button {
    padding: 5px 8px;
    font-size: 0.75rem;
  }
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.floating-nav-button.disabled,
.floating-nav-button:disabled {
  opacity: 0.35 !important;
  color: var(--color-text) !important;
  background-color: var(--color-card-bg) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  filter: grayscale(1) brightness(1.2);
}
</style>
