<script setup>
const model = defineModel();
</script>

<template>
    <input
        type="text"
        class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-200"
        v-model="model"
    >
</template>