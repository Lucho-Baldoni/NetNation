<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import useAuth from '../composables/useAuth';

const { loggedUser  } = useAuth();
</script>

<template>
    <div class="flex flex-col items-start gap-4">
        <BaseHeading1>Mi Perfil</BaseHeading1>
        <div class="flex gap-4">
            <router-link 
                to="/mi-perfil/editar"
                class="mb-4 bg-[#07DBA8] text-black py-2 px-4 rounded hover:bg-[#05b58b] transition duration-200"
            >Editar</router-link>
            <router-link 
                to="/mi-perfil/editar/foto"
                class="mb-4 bg-[#07DBA8] text-black py-2 px-4 rounded hover:bg-[#05b58b] transition duration-200"
            >Editar Foto</router-link>
        </div>
    </div>


    <div class="bg-white p-4 shadow-lg rounded-lg">
        <ProfileData :user="loggedUser " />
    </div>
</template>