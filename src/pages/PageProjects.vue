<template>
  <div class="projects-page">
    <!-- Page title -->
    <h1 id="projects-overview" class="text-center">{{ $t('projects.title') }}</h1>

    <!-- Filter functionality -->
    <div class="filter-container">
      <!-- Unified filter row: two centered rows, always visible on all devices -->
      <div class="filters-row">
        <div class="filter-row-inner" role="group" :aria-label="$t('projects.filterTypeGroupLabel')">
          <button @click="toggleTypeFilter(null)" class="filter-btn filter-type" :class="{ active: selectedTypes.length === 0 }"
            :aria-label="$t('projects.filterAllTypesAria')">
            {{ $t('projects.filterAll') }}
          </button>
          <button @click="toggleTypeFilter('frontend')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('frontend') }"
            :disabled="!isTypeTechComboAvailable('frontend', selectedTech)" :aria-label="$t('projects.filterFrontendAria')">
            {{ $t('projects.filterFE') }}
          </button>
          <button @click="toggleTypeFilter('backend')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('backend') }"
            :disabled="!isTypeTechComboAvailable('backend', selectedTech)" :aria-label="$t('projects.filterBackendAria')">
            {{ $t('projects.filterBE') }}
          </button>
          <button @click="toggleTypeFilter('fullstack')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('fullstack') }"
            :disabled="!isTypeTechComboAvailable('fullstack', selectedTech)" :aria-label="$t('projects.filterFullstackAria')">
            {{ $t('projects.filterFS') }}
          </button>
          <button @click="toggleTypeFilter('cli')" class="filter-btn filter-type" :class="{ active: selectedTypes.includes('cli') }"
            :disabled="!isTypeTechComboAvailable('cli', selectedTech)" :aria-label="$t('projects.filterCliAria')">
            {{ $t('projects.filterCLI') }}
          </button>
        </div>
        <div class="filter-row-inner" role="group" :aria-label="$t('projects.filterTechGroupLabel')">
          <button @click="toggleTechFilter(null)" class="filter-btn tech-filter-btn" :class="{ active: selectedTech.length === 0 }"
            :aria-label="$t('projects.filterAllTechAria')">
            <span>{{ $t('projects.filterAll') }}</span>
          </button>
          <button v-for="tech in popularTechnologies" :key="tech.title" @click="toggleTechFilter(tech.title)" class="filter-btn tech-filter-btn"
            :class="{ active: selectedTech.includes(tech.title) }" :disabled="!isTechTypeComboAvailable(tech.title, selectedTypes)"
            :aria-label="$t('projects.filterTechAria', { title: tech.title })">
            <img :src="tech.url" :alt="tech.title" :title="tech.title" class="tech-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filter results count for screen readers -->
    <div v-if="!loading && !fetchError" class="visually-hidden" aria-live="polite" aria-atomic="true">
      {{ $t('projects.filterResultsCount', { count: totalFilteredProjects }) }}
    </div>

    <!-- Loading and error indicators -->
    <div v-if="loading" class="text-center" role="status" aria-live="polite">
      <p>{{ $t('projects.loading') }}</p>
    </div>

    <div v-if="fetchError" role="alert" class="error-message">
      <p>{{ $t('projects.error') }}</p>
    </div>

    <!-- Main projects section -->
    <section v-if="filteredMainProjects.length > 0" aria-labelledby="main-projects">
      <h2 id="main-projects" class="text-center">{{ $t('projects.mainProjectsTitle') }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredMainProjects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Fullstack projects section -->
    <section v-if="filteredFullstackProjects.length > 0" aria-labelledby="fullstack-projects">
      <h2 id="fullstack-projects" class="text-center">{{ $t('projects.fullstackProjectsTitle') }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredFullstackProjects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>


    <!-- Frontend projects section -->
    <section v-if="filteredFrontendProjects.length > 0" aria-labelledby="frontend-projects">
      <h2 id="frontend-projects" class="text-center">{{ $t('projects.frontendProjectsTitle') }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredFrontendProjects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Backend projects section -->
    <section v-if="filteredBackendProjects.length > 0" aria-labelledby="backend-projects">
      <h2 id="backend-projects" class="text-center">{{ $t('projects.backendProjectsTitle') }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredBackendProjects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>


    <!-- CLI projects section -->
    <section v-if="filteredCliProjects.length > 0" aria-labelledby="cli-projects">
      <h2 id="cli-projects" class="text-center">{{ $t('projects.cliProjectsTitle') }}</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredCliProjects" :key="project.title" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Floating navigation - appears when scrolled down -->
    <Transition name="fade">
      <div v-if="showFloatingNav" class="floating-nav" role="navigation" :aria-label="$t('projects.floatingNavAria')">
        <button @click="toggleFloatingMenu" class="floating-nav-toggle" :aria-expanded="isFloatingMenuOpen"
          :aria-label="$t('projects.floatingNavToggleAria')">
          <span class="nav-icon" :class="{ rotated: isFloatingMenuOpen }">☰</span>
        </button>

        <Transition name="slide-up">
          <div v-if="isFloatingMenuOpen" class="floating-nav-menu" role="menu">
            <button @click="scrollToSection('back-to-top')" class="floating-nav-button" role="menuitem">
              {{ $t('projects.floatingBackToTop') }}
            </button>
            <button @click="scrollToSection('main-projects')" class="floating-nav-button" :class="{ disabled: !isMainVisible }"
              :disabled="!isMainVisible" role="menuitem">
              {{ $t('projects.floatingMain') }}
            </button>
            <button @click="scrollToSection('frontend-projects')" class="floating-nav-button" :class="{ disabled: !isFrontendVisible }"
              :disabled="!isFrontendVisible" role="menuitem">
              {{ $t('projects.floatingFrontend') }}
            </button>
            <button @click="scrollToSection('backend-projects')" class="floating-nav-button" :class="{ disabled: !isBackendVisible }"
              :disabled="!isBackendVisible" role="menuitem">
              {{ $t('projects.floatingBackend') }}
            </button>
            <button @click="scrollToSection('fullstack-projects')" class="floating-nav-button" :class="{ disabled: !isFullstackVisible }"
              :disabled="!isFullstackVisible" role="menuitem">
              {{ $t('projects.floatingFullstack') }}
            </button>
            <button @click="scrollToSection('cli-projects')" class="floating-nav-button" :class="{ disabled: !isCliVisible }"
              :disabled="!isCliVisible" role="menuitem">
              {{ $t('projects.floatingCli') }}
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import TheProjectCard from '../components/TheProjectCard.vue';

export default {
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
      dataURL: '/data.json',
      fetchError: false, // If data fetching fails, show error message
      loading: true, // For accessibility, show loading message while fetching data
      showFloatingNav: false, // Show floating nav when scrolled
      isFloatingMenuOpen: false, // Toggle for floating menu
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
    },
    isMainVisible() {
      return this.filteredMainProjects.length > 0;
    },
    isFrontendVisible() {
      return this.filteredFrontendProjects.length > 0;
    },
    isBackendVisible() {
      return this.filteredBackendProjects.length > 0;
    },
    isFullstackVisible() {
      return this.filteredFullstackProjects.length > 0;
    },
    isCliVisible() {
      return this.filteredCliProjects.length > 0;
    },
    totalFilteredProjects() {
      return this.filteredMainProjects.length +
        this.filteredFrontendProjects.length +
        this.filteredBackendProjects.length +
        this.filteredFullstackProjects.length +
        this.filteredCliProjects.length;
    },
  },
  methods: {
    // Check if any project exists for the given type and selected techs
    isTypeTechComboAvailable(type, techArr) {
      // If no tech selected, just check for type
      if (!techArr || techArr.length === 0) {
        return this.allProjects.some(p => p.type === type);
      }
      // If techArr contains more than one tech, only allow if a project has ALL those techs
      // But if no project has all selected techs, disable
      return this.allProjects.some(p => p.type === type && techArr.length > 0 && techArr.every(t => p.technologyTitles && p.technologyTitles.includes(t)));
    },
    // Check if any project exists for the given tech and selected type
    isTechTypeComboAvailable(tech, typeArr) {
      // If tech is already selected, always allow to deselect
      if (this.selectedTech.includes(tech)) return true;

      // If no type selected, check if any project has all selected techs + this tech
      if (!typeArr || typeArr.length === 0) {
        const nextTechs = [...this.selectedTech, tech];
        return this.allProjects.some(p => nextTechs.every(t => p.technologyTitles && p.technologyTitles.includes(t)));
      }
      // If type selected, check if any project matches type and all selected techs + this tech
      const nextTechs = [...this.selectedTech, tech];
      return this.allProjects.some(p => typeArr.includes(p.type) && nextTechs.every(t => p.technologyTitles && p.technologyTitles.includes(t)));
    },
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
      const response = await fetch(this.dataURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.technologies = data.technologies.flatMap(group => group.items);
        this.allProjects = data.projects;
        this.mainProjects = data.projects.filter(p => p.isMain === true);
        this.frontendProjects = data.projects.filter(p => p.type === 'frontend' && !p.isMain);
        this.backendProjects = data.projects.filter(p => p.type === 'backend' && !p.isMain);
        this.fullstackProjects = data.projects.filter(p => p.type === 'fullstack' && !p.isMain);
        this.cliProjects = data.projects.filter(p => p.type === 'cli' && !p.isMain);
      }
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

/* Filter-btn for all filter buttons */
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

  .filters-row {
    gap: 8px;
    margin-bottom: 12px;
    background: none;
    border-radius: 0;
    box-shadow: none;
    border: none;
    max-width: 98vw;
    width: 100%;
    transition: none;
    z-index: 20;
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

}

/* Very small mobile specific adjustments */
@media (max-width: 400px) {
  .tech-icon {
    width: 16px;
    height: 16px;
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
