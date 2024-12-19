<script setup>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { ref, provide } from 'vue';
import { dependencyGlobalFeedbackKey } from './constants/dependency-keys';

const feedback = ref({
    message: null,
    type: 'info',
    title: null,
});

provide(dependencyGlobalFeedbackKey, {

    /**
     * 
     * @param {{message: string|null, type: string, title: string|null}} newData 
     */
    updateGlobalFeedback(newData) {
        feedback.value = {
            ...feedback.value,
            ...newData,
        }
    },
    clearGlobalFeedback() {
        this.updateGlobalFeedback({
            message: null,
        });
    },
});
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <div 
            v-if="feedback.message"
            class="p-4 mb-4 bg-green-200 rounded"
        >
            {{ feedback.message }}
        </div>
        <router-view />
    </main>
    <AppFooter />
</template>