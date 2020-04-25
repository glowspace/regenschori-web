<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark absolute-top">
      <div class="container d-flex justify-content-between">
        <div class="navbar-brand">
          <h1 class="text-uppercase mb-0 ">Regenschori</h1>
          <p class="small">Otevřená databáze křesťanské hudby</p>
        </div>

        <div class="navbar-caption">"Kdo zpívá, dvakrát se modlí." - sv. Augustin</div>
      </div>
    </nav>

    <a class="invisible btn btn-secondary mobile-padding-button mb-0">
      <i class="fas fa-search"></i>
    </a>

    <nav class="navbar navbar-expand-lg navbar-dark fixed-top navbar-scrolled">
      <div class="container d-flex">
        <div class="div">
          <nuxt-link to="/"
                     class="btn btn-logo">
            Regenschori</nuxt-link>
        </div>

        <div class="navbar-caption">"Kdo zpívá, dvakrát se modlí." - sv. Augustin</div>
      </div>
    </nav>
  </div>
</template>

<script>
  import DarkModeButton from "~/components/DarkModeButton";

  export default {
    name: "Navbar",

    components: {DarkModeButton}
  }
</script>

<style scoped
       lang="scss">
  .navbar {
    height:           130px;

    background-color: #151e26;
    color:            white;

    box-shadow:       none;

    .navbar-brand {
      h1 {
        line-height:   32px;
        font-family:   Helvetica, sans-serif;

        margin-bottom: 3px;
      }

      p {
        font-family: PingFang, sans-serif;
        font-size:   12px;
        color:       #bababa
      }
    }

    .navbar {
      z-index:          200;
      background-color: #292929;
      min-height:       66px;
    }

    .navbar-brand {
      padding: 0 0.5rem;
    }

    .navbar-label {
      padding:          3px 10px;

      background-color: #292929;
      color:            white;
    }


    .navbar-caption {
      font-family: PingFang, sans-serif;
      color:       #bababa;

      font-size:   12px;
    }
  }

  .navbar-scrolled {
    height: 35px;

    .btn-logo {
      font-family:    Helvetica,sans-serif;
      text-transform: uppercase;

      color: white;
    }
  }
</style>
