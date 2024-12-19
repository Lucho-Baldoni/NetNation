<script setup>
import BaseLoader from './BaseLoader.vue';

defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
});
</script>

<template>
    <div 
        v-if="loading"
        class="flex justify-center p-4"
    >
        <BaseLoader />
    </div>
    <template v-else>
        <slot />
    </template>
</template>