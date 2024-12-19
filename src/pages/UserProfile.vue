<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import LoadingContext from '../components/LoadingContext.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';

const route = useRoute();

const { loadingUser, user } = useUserProfile(route.params.id);
</script>

<template>
    <LoadingContext :loading="loadingUser">
        <div class="relative profile-card bg-black p-4 rounded-lg shadow-md">
            <router-link
                :to="`/usuario/${user.id}/chat`"
                class="absolute top-4 right-4 text-black bg-[#07DBA8] hover:bg-[#05b58b] py-2 px-4 rounded"
            >Chatear con {{ user.displayName }}</router-link>
            
            <BaseHeading1>Perfil de {{ user.displayName }}</BaseHeading1>

            <ProfileData :user="user" />

        </div>
    </LoadingContext>
</template>

<style scoped>
.profile-card {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>