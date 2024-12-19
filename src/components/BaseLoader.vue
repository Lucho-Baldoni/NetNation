<template>
    <div class="loader border-8 border-slate-400 border-r-slate-700">
        <span class="sr-only">Cargando...</span>
    </div>
</template>

<style scoped>
.loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: l2 1s infinite linear;
}
@keyframes l2 {to{transform: rotate(1turn)}}
</style>