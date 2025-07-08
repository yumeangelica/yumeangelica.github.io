<template>
  <div class="projects-page">
    <!-- Page title -->
    <h1 id="projects-overview" class="text-center">My Project Portfolio</h1>

    <!-- Filter functionality -->
    <div class="filter-container">
      <!-- Mobile toggle buttons -->
      <div class="mobile-toggles">
        <button @click="toggleMobileFilters" class="mobile-toggle-btn" :aria-expanded="showMobileFilters">
          <span>🔍</span>
          <span>Filter</span>
          <span class="toggle-arrow" :class="{ rotated: showMobileFilters }">▼</span>
        </button>
      </div>

      <!-- Unified filter row: two centered rows, no headings -->
      <div class="filters-row" :class="{ 'mobile-hidden': !showMobileFilters }">
        <div class="filter-row-inner">
          <button @click="toggleTypeFilter(null)" class="filter-btn filter-type" :class="{ active: selectedTypes.length === 0 }"
            aria-label="Show all types">
            All
          </button>
          <button @click="toggleTypeFilter('frontend')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('frontend') }"
            aria-label="Frontend projects">
            FE
          </button>
          <button @click="toggleTypeFilter('backend')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('backend') }"
            aria-label="Backend projects">
            BE
          </button>
          <button @click="toggleTypeFilter('fullstack')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('fullstack') }"
            aria-label="Fullstack projects">
            FS
          </button>
          <button @click="toggleTypeFilter('cli')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('cli') }"
            aria-label="CLI projects">
            CLI
          </button>
        </div>
        <div class="filter-row-inner">
          <button @click="toggleTechFilter(null)" class="filter-btn tech-filter-btn" :class="{ active: selectedTech.length === 0 }"
            aria-label="Show all technologies">
            <span>All</span>
          </button>
          <button v-for="tech in popularTechnologies" :key="tech.title" @click="toggleTechFilter(tech.title)" class="filter-btn tech-filter-btn"
            :class="{ active: selectedTech.includes(tech.title) }" :aria-label="`Filter by ${tech.title}`">
            <img :src="tech.url" :alt="tech.title" :title="tech.title" class="tech-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading and error indicators -->
    <div v-if="loading" class="text-center" role="status" aria-live="polite">
      <p>Loading projects...</p>
    </div>

    <div v-if="dataHandleError" role="alert" class="error-message">
      <p>Sorry, there was an error loading projects. Please try again later.</p>
    </div>

    <!-- Main projects section -->
    <section v-if="filteredMainProjects.length > 0" aria-labelledby="main-projects">
      <h2 id="main-projects" class="text-center">Main Projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredMainProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Fullstack projects section -->
    <section v-if="filteredFullstackProjects.length > 0" aria-labelledby="fullstack-projects">
      <h2 id="fullstack-projects" class="text-center">Fullstack Projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredFullstackProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>


    <!-- Frontend projects section -->
    <section v-if="filteredFrontendProjects.length > 0" aria-labelledby="frontend-projects">
      <h2 id="frontend-projects" class="text-center">Frontend Projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredFrontendProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Backend projects section -->
    <section v-if="filteredBackendProjects.length > 0" aria-labelledby="backend-projects">
      <h2 id="backend-projects" class="text-center">Backend Projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredBackendProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>


    <!-- CLI projects section -->
    <section v-if="filteredCliProjects.length > 0" aria-labelledby="cli-projects">
      <h2 id="cli-projects" class="text-center">CLI Projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredCliProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Floating navigation - appears when scrolled down -->
    <Transition name="fade">
      <div v-if="showFloatingNav" class="floating-nav" role="navigation" aria-label="Quick navigation menu">
        <button @click="toggleFloatingMenu" class="floating-nav-toggle" :aria-expanded="isFloatingMenuOpen" aria-label="Toggle quick navigation menu">
          <span class="nav-icon" :class="{ rotated: isFloatingMenuOpen }">☰</span>
        </button>

        <Transition name="slide-up">
          <div v-if="isFloatingMenuOpen" class="floating-nav-menu" role="menu">
            <button @click="scrollToSection('back-to-top')" class="floating-nav-button" role="menuitem">
              ⬆ Back to Top
            </button>
            <button @click="scrollToSection('frontend-projects')" class="floating-nav-button" role="menuitem">
              🎨 Frontend
            </button>
            <button @click="scrollToSection('backend-projects')" class="floating-nav-button" role="menuitem">
              🛠 Backend
            </button>
            <button @click="scrollToSection('fullstack-projects')" class="floating-nav-button" role="menuitem">
              🌐 Fullstack
            </button>
            <button @click="scrollToSection('cli-projects')" class="floating-nav-button" role="menuitem">
              ⚡ CLI
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import TheProjectCard from '../components/TheProjectCard.vue';
import { ref, computed } from 'vue';

export default {
  data() {
    return {
      allProjects: ref([]),
      frontendProjects: ref([]),
      backendProjects: ref([]),
      fullstackProjects: ref([]),
      cliProjects: ref([]),
      mainProjects: ref([]),
      technologies: ref([]),
      selectedTech: [], // For technology filtering, multi-select, all by default
      selectedTypes: [], // For type filtering, single-select, all by default
      dataURL: '../data.json',
      dataHandleError: ref(false), // If data fetching fails, show error message
      loading: ref(true), // For accessibility, show loading message while fetching data
      showFloatingNav: false, // Show floating nav when scrolled
      isFloatingMenuOpen: false, // Toggle for floating menu
      showMobileFilters: false, // Toggle for mobile filter visibility
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
      return this.technologies.filter(tech => techNames.includes(tech.title));
    },
    filteredMainProjects() {
      // Only main projects, filtered by type/tech
      return this.filterProjects(this.mainProjects);
    },
    filteredFrontendProjects() {
      // Only non-main frontend projects
      return this.filterProjects(this.frontendProjects);
    },
    filteredBackendProjects() {
      return this.filterProjects(this.backendProjects);
    },
    filteredFullstackProjects() {
      return this.filterProjects(this.fullstackProjects);
    },
    filteredCliProjects() {
      return this.filterProjects(this.cliProjects);
    }
  },
  methods: {
    filterProjects(projects) {
      // Filter by type first
      let filtered = projects;
      if (this.selectedTypes && this.selectedTypes.length > 0) {
        filtered = filtered.filter(project => this.selectedTypes.includes(project.type));
      }
      // Then filter by tech
      if (!this.selectedTech || this.selectedTech.length === 0) return filtered;
      return filtered.filter(project => {
        if (!project.technologyTitles) return false;
        return this.selectedTech.every(tech => project.technologyTitles.includes(tech));
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
          behavior: 'smooth'
        });
        this.isFloatingMenuOpen = false; // Close menu after navigation
        return;
      }

      // Regular section scrolling
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.isFloatingMenuOpen = false; // Close menu after navigation
      }
    },
    toggleFloatingMenu() {
      this.isFloatingMenuOpen = !this.isFloatingMenuOpen;
    },
    toggleMobileFilters() {
      this.showMobileFilters = !this.showMobileFilters;
    },
    handleScroll() {
      // Show floating nav when scrolled down 200px
      this.showFloatingNav = window.scrollY > 200;

      // Close floating menu when scrolling
      if (this.isFloatingMenuOpen) {
        this.isFloatingMenuOpen = false;
      }
    }
  },
  async created() { // When site is loaded, fetch data from data.json
    try {
      const response = await fetch(this.dataURL);
      const data = await response.json();
      if (data) {
        this.technologies = data.technologies;
        this.allProjects = data.projects;
        this.mainProjects = data.projects.filter(p => p.isMain === true);
        this.frontendProjects = data.projects.filter(p => p.type === 'frontend' && !p.isMain);
        this.backendProjects = data.projects.filter(p => p.type === 'backend' && !p.isMain);
        this.fullstackProjects = data.projects.filter(p => p.type === 'fullstack' && !p.isMain);
        this.cliProjects = data.projects.filter(p => p.type === 'cli' && !p.isMain);
      }
      this.loading = false;
    } catch (error) {
      this.dataHandleError = true;
      this.loading = false;
      console.log(error.message);
    }
  },
  mounted() {
    // Add scroll listener for floating navigation
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    // Clean up scroll listener
    window.removeEventListener('scroll', this.handleScroll);
  }
}

</script>



<style scoped>
/* Main page container */
.projects-page {
  padding-bottom: 50px;
}

/* Mobile adjustments for bottom padding */
@media (max-width: 768px) {
  .projects-page {
    padding-bottom: 50px;
  }
}

@media (max-width: 568px) {
  .projects-page {
    padding-bottom: 50px;
  }
}



/* Compact unified filter row */

.filters-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 0 4px;
}

.filter-row-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Yhdistetty filter-btn kaikille filter-napeille */
.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.85rem;
  border-radius: 16px;
  padding: 4px 10px;
  min-width: 0;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border: 1.5px solid var(--color-primary-light);
  opacity: 0.95;
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.filter-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Nav-button erikoistapaukset */
.nav-button.secondary {
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border: 1px solid var(--color-primary-light);
  opacity: 0.9;
}

.tech-filter-btn {
  gap: 0;
  min-height: 28px;
  line-height: 1.1;
  padding: 4px 7px;
}

.tech-filter-btn span {
  display: inline;
  font-size: 0.85rem;
  margin-left: 2px;
}

.tech-icon {
  width: 22px;
  height: 22px;
  border-radius: 3px;
  transition: box-shadow 0.2s;
}

@media (max-width: 768px) {
  .filters-row {
    gap: 4px;
    margin-bottom: 12px;
  }

  .filter-row-inner {
    gap: 4px;
  }

  .tech-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 568px) {
  .filters-row {
    gap: 2px;
    margin-bottom: 8px;
  }

  .filter-row-inner {
    gap: 2px;
  }

  .filter-btn {
    padding: 3px 6px;
    font-size: 0.75rem;
    border-radius: 12px;
  }

  .tech-icon {
    width: 14px;
    height: 14px;
  }
}

/* Project containers */
.projects-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  align-items: stretch;
  padding: 10px;
  margin-bottom: 30px;
}


/* Mobile and small tablet mode */
@media (max-width: 768px) {
  .projects-container {
    flex-direction: column;
    align-items: center;
    padding: 0px;
  }

  .filter-container {
    margin-bottom: 30px;
    padding: 0 10px;
  }

  /* Show mobile toggles on mobile and small tablets */
  .mobile-toggles {
    display: flex;
  }

  /* Nicer dropdown for filters on mobile */
  .filters-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 16px 10px 12px 10px;
    background: var(--color-card-bg, #fff);
    border-radius: 18px;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.10);
    border: 1.5px solid var(--color-primary-light, #e0e0e0);
    max-width: 98vw;
    width: 100%;
    transition: box-shadow 0.2s;
    z-index: 20;
  }

  .filters-row.mobile-hidden {
    display: none !important;
  }

  .filter-row-inner {
    gap: 8px;
    width: 100%;
    justify-content: center;
  }

  .filter-btn {
    min-width: 44px;
    min-height: 32px;
    font-size: 0.92rem;
    border-radius: 14px;
    box-shadow: none;
  }

  .filter-btn {
    background: var(--color-white, #fff);
    border: 1.5px solid var(--color-primary-light, #e0e0e0);
  }

  .filter-btn.active {
    background: var(--color-primary, #6c63ff);
    color: var(--color-white, #fff);
    border-color: var(--color-primary, #6c63ff);
  }

  .filter-btn:focus-visible {
    outline: 2px solid var(--color-primary, #6c63ff);
    outline-offset: 2px;
  }

  .tech-icon {
    width: 20px;
    height: 20px;
  }

  .mobile-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
    padding: 7px 14px;
    background: var(--color-card-bg, #fff);
    color: var(--color-primary-dark, #4b2a3a);
    border: 1.5px solid var(--color-primary-light, #e0e0e0);
    border-radius: 18px;
    font-size: 0.98rem;
    font-weight: 600;
    box-shadow: 0 2px 8px 0 rgba(108, 99, 255, 0.07);
    transition: background 0.18s, box-shadow 0.18s, transform 0.13s, color 0.18s;
    cursor: pointer;
    min-width: 72px;
    min-height: 32px;
    letter-spacing: 0.01em;
    position: relative;
    z-index: 30;
  }

  .mobile-toggle-btn span:first-child {
    font-size: 1.08em;
    margin-right: 4px;
    display: flex;
    align-items: center;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.10));
  }

  .mobile-toggle-btn span.toggle-arrow {
    margin-left: 6px;
    font-size: 1em;
    transition: transform 0.25s cubic-bezier(.4, 2, .6, 1), color 0.2s;
    display: inline-block;
    color: var(--color-primary-dark, #4b2a3a);
  }

  .mobile-toggle-btn .toggle-arrow.rotated {
    transform: rotate(180deg) scale(1.08);
    color: var(--color-accent-dark, #b05a7a);
  }

  .mobile-toggle-btn:active {
    transform: scale(0.97);
    box-shadow: 0 1px 4px 0 rgba(108, 99, 255, 0.07);
  }

  .mobile-toggle-btn:hover,
  .mobile-toggle-btn:focus-visible {
    background: var(--color-primary-light, #f5f2f7);
    color: var(--color-primary-dark, #4b2a3a);
    box-shadow: 0 3px 10px 0 rgba(108, 99, 255, 0.10);
    transform: translateY(-1px) scale(1.01);
    outline: 2px solid var(--color-accent-dark, #b05a7a);
    outline-offset: 2px;
  }

  @media (max-width: 568px) {
    .mobile-toggle-btn {
      padding: 6px 8px;
      font-size: 0.92rem;
      min-width: 60px;
      min-height: 28px;
      border-radius: 12px;
    }

    .mobile-toggle-btn span:first-child {
      font-size: 1em;
    }

    .mobile-toggle-btn span.toggle-arrow {
      font-size: 0.92em;
    }
  }
}

/* Very small mobile specific adjustments */
@media (max-width: 400px) {
  .mobile-toggle-btn {
    padding: 8px 10px;
    font-size: 0.92rem;
    min-width: 80px;
    min-height: 36px;
    border-radius: 14px;
  }

  .navigation-section h3,
  .technology-section h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .nav-buttons {
    gap: 8px;
  }

  .nav-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .tech-filters {
    gap: 8px;
  }

  .tech-filter-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .tech-icon {
    width: 16px;
    height: 16px;
  }
}

/* Larger tablet and desktop mode - hide mobile toggles, show all sections */
@media (min-width: 769px) {
  .mobile-toggles {
    display: none;
  }

  .filters-row {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 18px;
    padding: 0 4px;
  }
}

/* Add styling for error message */
.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-duration) ease;
}

.floating-nav-toggle:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
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
  background-color: var(--color-white);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
  border: 1px solid var(--color-primary-light);
}

.floating-nav-button {
  padding: 8px 12px;
  background-color: transparent;
  color: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition: all var(--transition-duration) ease;
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
    bottom: 70px;
    right: 10px;
  }

  .floating-nav-toggle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .floating-nav-menu {
    bottom: 50px;
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
  transition: all 0.2s ease;
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
</style>
