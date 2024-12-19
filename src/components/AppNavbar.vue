<script setup>
import { useRouter } from 'vue-router';
import useAuth from '../composables/useAuth';
import { logout } from '../services/auth';

const router = useRouter();
const { loggedUser   } = useAuth();

function handleLogout() {
    logout();
    router.push('/iniciar-sesion');
}
</script>

<template>
    <div class="flex flex-col items-center">
        <nav class="fixed top-0 left-1/2 transform -translate-x-1/2 flex justify-between items-center p-4 text-slate-800 w-auto rounded-b-lg" style="background-color: #07DBA8; color: black;">
            <router-link to="/" class="text-xl">DV Social</router-link>

            <ul class="flex gap-4">
                <template v-if="loggedUser .id === null">
                    <li>
                        <router-link class="block py-1 px-2" to="/">
                            <i class="fas fa-home"></i> Home
                        </router-link>
                    </li>
                </template>
                <template v-if="loggedUser .id !== null">
                    <li>
                        <router-link class="block py-1 px-2" to="/publicaciones">
                            <i class="fas fa-newspaper"></i> Home
                        </router-link>
                    </li>
                    <li>
                        <router-link class="block py-1 px-2" to="/mi-perfil">
                            <i class="fas fa-user"></i> Mi Perfil
                        </router-link>
                    </li>
                    <li>
                        <form action="#" @submit.prevent="handleLogout">
    <button type="submit" class="block py-1 px-2" title="Salir">
        {{ loggedUser.displayName }} <i class="fas fa-sign-out-alt"></i> (Salir)
    </button>
</form>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <router-link class="block py-1 px-2" to="/registro">
                            <i class="fas fa-user-plus"></i> Registrarse
                        </router-link>
                    </li>
                    <li>
                        <router-link class="block py-1 px-2" to="/iniciar-sesion">
                            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                        </router-link>
                    </li>
                </template>
            </ul>
        </nav>
        <div class="mt-20">
            
        </div>
    </div>
</template>