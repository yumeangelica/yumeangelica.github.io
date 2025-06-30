<template>
  <div class="projects-page">
    <!-- Page title -->
    <h1 id="projects-overview" class="text-center">My Project Portfolio</h1>

    <!-- Filter functionality -->
    <div class="filter-container">
      <!-- Mobile toggle buttons -->
      <div class="mobile-toggles">
        <button @click="toggleMobileNavigation" class="mobile-toggle-btn" :aria-expanded="showMobileNavigation">
          <span>📋</span>
          <span>Jump to</span>
          <span class="toggle-arrow" :class="{ rotated: showMobileNavigation }">▼</span>
        </button>
        <button @click="toggleMobileFilters" class="mobile-toggle-btn" :aria-expanded="showMobileFilters">
          <span>🔍</span>
          <span>Filter by tech</span>
          <span class="toggle-arrow" :class="{ rotated: showMobileFilters }">▼</span>
        </button>
      </div>

      <!-- Quick navigation -->
      <div class="navigation-section" :class="{ 'mobile-hidden': !showMobileNavigation }">
        <h3>Jump to:</h3>
        <div class="nav-buttons">
          <button @click="scrollToSection('main-projects')" class="nav-button main-highlight">⭐ Main Projects</button>
          <button @click="scrollToSection('web-dev-projects')" class="nav-button secondary">🌐 Web Fullstack</button>
          <button @click="scrollToSection('cli-projects')" class="nav-button secondary">⚡ CLI Tools</button>
          <button @click="scrollToSection('js-projects')" class="nav-button secondary">✨ VanillaJS</button>
        </div>
      </div>

      <!-- Technology filters -->
      <div class="technology-section" :class="{ 'mobile-hidden': !showMobileFilters }">
        <h3>Filter by technology:</h3>
        <div class="tech-filters">
          <button @click="toggleTechFilter(null)" :class="['tech-filter-btn', { active: selectedTech === null }]" aria-label="Show all projects">
            All
          </button>
          <button v-for="tech in popularTechnologies" :key="tech.title" @click="toggleTechFilter(tech.title)"
            :class="['tech-filter-btn', { active: selectedTech === tech.title }]" :aria-label="`Filter by ${tech.title}`">
            <img :src="tech.url" :alt="tech.title" :title="tech.title" class="tech-icon" />
            <span>{{ tech.title }}</span>
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
      <h2 id="main-projects" class="text-center">Main projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredMainProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Other web fullstack projects section -->
    <section v-if="filteredWebDevelopmentProjects.length > 0" aria-labelledby="web-dev-projects">
      <h2 id="web-dev-projects" class="text-center">Other web fullstack projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredWebDevelopmentProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- Other command-line projects section -->
    <section v-if="filteredCommandLineProjects.length > 0" aria-labelledby="cli-projects">
      <h2 id="cli-projects" class="text-center">Other command-line projects</h2>
      <div class="projects-container" aria-live="polite" :aria-busy="loading">
        <TheProjectCard v-for="project in filteredCommandLineProjects" :key="project.id" :project="project" :technologies="technologies" />
      </div>
    </section>

    <!-- VanillaJS projects section -->
    <section v-if="filteredVanillajsProjects.length > 0" aria-labelledby="js-projects">
      <h2 id="js-projects" class="text-center">VanillaJS projects</h2>
      <div class="other-projects-container" aria-live="polite" :aria-busy="loading">
        <TheSmallerProjectCard v-for="project in filteredVanillajsProjects" :key="project.id" :project="project" />
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
            <button @click="scrollToSection('main-projects')" class="floating-nav-button" role="menuitem">
              ⭐ Main Projects
            </button>
            <button @click="scrollToSection('web-dev-projects')" class="floating-nav-button" role="menuitem">
              🌐 Web Fullstack
            </button>
            <button @click="scrollToSection('cli-projects')" class="floating-nav-button" role="menuitem">
              ⚡ CLI Tools
            </button>
            <button @click="scrollToSection('js-projects')" class="floating-nav-button" role="menuitem">
              ✨ VanillaJS
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import TheProjectCard from '../components/TheProjectCard.vue';
import TheSmallerProjectCard from '../components/TheSmallerProjectCard.vue';
import { ref, computed } from 'vue';

export default {
  data() {
    return {
      mainProjects: ref([]),
      webDevelopmentProjects: ref([]),
      commandLineProjects: ref([]),
      vanillajsProjects: ref([]),
      technologies: ref([]),
      selectedTech: null, // For technology filtering
      dataURL: '../data.json',
      dataHandleError: ref(false), // If data fetching fails, show error message
      loading: ref(true), // For accessibility, show loading message while fetching data
      showFloatingNav: false, // Show floating nav when scrolled
      isFloatingMenuOpen: false, // Toggle for floating menu
      showMobileFilters: false, // Toggle for mobile filter visibility
      showMobileNavigation: false // Toggle for mobile navigation visibility
    }
  },
  components: {
    TheProjectCard,
    TheSmallerProjectCard
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
        'PHP'          // Backend language #2
      ];
      return this.technologies.filter(tech => techNames.includes(tech.title));
    },
    filteredMainProjects() {
      return this.filterProjects(this.mainProjects);
    },
    filteredWebDevelopmentProjects() {
      return this.filterProjects(this.webDevelopmentProjects);
    },
    filteredCommandLineProjects() {
      return this.filterProjects(this.commandLineProjects);
    },
    filteredVanillajsProjects() {
      return this.filterProjects(this.vanillajsProjects);
    }
  },
  methods: {
    filterProjects(projects) {
      if (!this.selectedTech) return projects;

      return projects.filter(project => {
        return project.technologyTitles && project.technologyTitles.includes(this.selectedTech);
      });
    },
    toggleTechFilter(techName) {
      this.selectedTech = this.selectedTech === techName ? null : techName;
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
    toggleMobileNavigation() {
      this.showMobileNavigation = !this.showMobileNavigation;
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
      if (data) { // If data is fetched successfully, assign it to projects and technologies
        this.technologies = data.technologies;
        this.mainProjects = data.projects.filter(p => p.type === 'mainProject');
        this.webDevelopmentProjects = data.projects.filter(p => p.type === 'webDevelopment');
        this.commandLineProjects = data.projects.filter(p => p.type === 'commandLine');
        this.vanillajsProjects = data.projects.filter(p => p.type === 'vanillajsProject');
      }
      this.loading = false; // When data is fetched, set loading to false
    } catch (error) {
      this.dataHandleError = true;
      this.loading = false; // When data fetching fails, set loading to false
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

/* Filter functionality styles */
.filter-container {
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Mobile toggle buttons - hidden by default, shown only on mobile */
.mobile-toggles {
  display: none;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.mobile-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary);
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  font-weight: 600;
  min-width: 120px;
  justify-content: space-between;
}

.mobile-toggle-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-1px);
}

.mobile-toggle-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.toggle-arrow {
  transition: transform var(--transition-duration) ease;
  font-size: 0.8rem;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

/* Hide sections on mobile when collapsed */
.mobile-hidden {
  display: none;
}

/* Navigation section */
.navigation-section {
  margin-bottom: 25px;
  text-align: center;
}

.navigation-section h3 {
  font-size: 1.1rem;
  color: var(--color-primary-dark);
  margin-bottom: 10px;
  font-weight: 600;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.nav-button {
  padding: 8px 16px;
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  font-weight: 500;
}

.nav-button:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-1px);
}

.nav-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Highlight main projects button */
.nav-button.main-highlight {
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button.main-highlight:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Secondary navigation buttons */
.nav-button.secondary {
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border: 1px solid var(--color-primary-light);
  opacity: 0.9;
}

.nav-button.secondary:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  opacity: 1;
}

/* Technology section */
.technology-section {
  text-align: center;
}

.technology-section h3 {
  font-size: 1.1rem;
  color: var(--color-primary-dark);
  margin-bottom: 15px;
  font-weight: 600;
}

.tech-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.tech-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border: 2px solid var(--color-primary-light);
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  font-weight: 500;
}

.tech-filter-btn:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  transform: translateY(-1px);
}

.tech-filter-btn.active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.tech-filter-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.tech-icon {
  width: 20px;
  height: 20px;
  border-radius: 3px;
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

.other-projects-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

/* Mobile and small tablet mode rules */
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

  /* Always show sections (they're controlled by mobile-hidden class) */
  .navigation-section,
  .technology-section {
    display: block;
  }

  /* Override mobile-hidden for small screens */
  .mobile-hidden {
    display: none !important;
  }
}

/* Very small mobile specific adjustments */
@media (max-width: 568px) {
  .mobile-toggle-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
    min-width: 100px;
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

  .navigation-section,
  .technology-section {
    display: block !important;
  }

  .mobile-hidden {
    display: block !important;
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
