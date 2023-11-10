<template>
  <h1>Elegant Web Development Creations</h1>

  <div class="row">
    <div class="col-md-4">
      <div class="card d-flex">
        <img src="../assets/img/fullstack-phonebook-application-project.png" class="card-img-top" alt="Project Image" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">Fullstack phonebook app</h5>
          <div class="card-text">MERN-stack, tests, CI/CD, Docker</div>
          <div class="card-text">Features: Full-stack, CRUD functionality</div>
          <div class="card-text">Hosted On: Fly.io</div>
          <a href="https://fullstack-phonebook-application.fly.dev/" class="btn btn-primary" target="_blank">Learn More</a>
          <a href="https://github.com/yumeangelica/fullstack-phonebook-application" class="btn btn-primary" target="_blank">Source Code</a>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card d-flex">
        <img src="../assets/img/portfolio-project.png" class="card-img-top" alt="Project Image" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">Personal portfolio</h5>
          <div class="card-text">Vue.js & CSS</div>
          <div class="card-text">Showing my website design skills & Vue.js skills</div>
          <div class="card-text">Hosted On: GitHub pages</div>
          <a href="https://github.com/yumeangelica/yumeangelica.github.io/" class="btn btn-primary" target="_blank">Source Code</a>
        </div>
      </div>
    </div>
  </div>
</template>



<style>
  .card {
    background-color: var(--kawaii-purple);
    margin: 5px;
  }

  .card-text {
    margin-bottom: 10px;
    color: var(--kawaii-font-color);
  }


  .btn-primary {
    color: var(--white);
    background-color: var(--kawaii-dark-pink);
    border-color: var(--kawaii-light-blue);
    margin: 5px;
  }


  .btn-primary:hover {
    color: var(--kawaii-purple);
    background-color: var(--kawaii-dark-pink);
    border-color: var(--kawaii-light-blue);
    transition-duration: var(--kawaii-transition-duration);
  }
</style>
