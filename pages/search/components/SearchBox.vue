<template>
    <div class="card">
      <div class="card-body">
        <div class="search-category">Část mše</div>

        <badge-toggle title="Úvod"/>
        <badge-toggle title="Před evangeliem"/>
        <badge-toggle title="Obětní průvod"/>
        <badge-toggle title="Přijímání"/>
        <badge-toggle title="Závěr"/>

        <div class="search-category">Liturgická doba</div>

        <badge-toggle title="Mezidobí"/>
        <badge-toggle title="Velikonoce"/>
        <badge-toggle title="Vánoce"/>

        <div class="search-category">Typ</div>

        <badge-toggle title="Úvod"/>
        <badge-toggle title="Obětování"/>
        <badge-toggle title="Přijímání"/>
        <badge-toggle title="Závěr"/>

        <div class="search-category">Období</div>

        <badge-toggle title="Úvod"/>
        <badge-toggle title="Obětování"/>
        <badge-toggle title="Přijímání"/>
        <badge-toggle title="Závěr"/>
      </div>
    </div>
</template>

<script>
    import BadgeToggle from "~/components/BadgeToggle";
    export default {
        name: "SearchBox",
      components: {BadgeToggle}
    }
</script>

<style scoped>
.search-category {
  margin-top: 15px;

  padding-bottom: 10px;
  margin-bottom: 15px;

  border-bottom: 1px solid #d7d7d7;
}
</style>
