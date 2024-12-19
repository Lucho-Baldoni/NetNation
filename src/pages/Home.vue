<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
</script>

<template>
  <div class="home-container">
    <img src="/banner.jpg" alt="Banner" class="banner-image" />
    <BaseHeading1 class="text-white">Bienvenido a Net Nation</BaseHeading1>
    <p class="text-white">¡Les damos la bienvenida a la mejor red social para conocer personas!</p>
    
    <section class="features">
      <BaseHeading1 class="text-white">¿Qué Puedes Hacer Aquí?</BaseHeading1>
      <ul class="text-white">
        <li>Conectar con personas de todo el mundo.</li>
        <li>Compartir tus intereses y hobbies.</li>
        <li>Descubrir nuevas amistades y relaciones.</li>
      </ul>
    </section>
    
    <section class="subscription">
      <BaseHeading1 class="text-white">¿Por Qué Suscribirte?</BaseHeading1>
      <ul class="text-white">
        <li>Soporte prioritario y asistencia personalizada.</li>
        <li>Formar parte de una comunidad activa y comprometida.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  text-align: center;
  padding: 20px;
  background-color: #1a202c; /* Fondo oscuro */
  color: #fff; /* Texto blanco */
  min-height: 100vh; /* Altura mínima para ocupar toda la pantalla */
}

.banner-image {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra */
}

.features, .subscription {
  margin-top: 20px;
  background-color: #2d3748; /* Fondo ligeramente más claro */
  padding: 20px;
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #4a5568; /* Fondo de los elementos de la lista */
  border-radius: 5px; /* Bordes redondeados */
}

li:not(:last-child) {
  margin-bottom: 10px; /* Espacio entre los elementos de la lista */
}
</style>