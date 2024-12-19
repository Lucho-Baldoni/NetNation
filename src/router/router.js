
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import MyProfileEditPhoto from '../pages/MyProfileEditPhoto.vue';
import UserProfile from '../pages/UserProfile.vue';
import Publicaciones from '../pages/Publicaciones.vue';
import PrivateChat from '../pages/PrivateChat.vue';

const routes = [
    { path: '/',                        component: Home, },
    { path: '/registro',                component: Register, },
    { path: '/iniciar-sesion',          component: Login, },
    { path: '/mi-perfil',               component: MyProfile,           meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar',        component: MyProfileEdit,       meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar/foto',   component: MyProfileEditPhoto,  meta: { requiresAuth: true } },
    { path: '/usuario/:id',             component: UserProfile,         meta: { requiresAuth: true } },
    { path: '/publicaciones',           component: Publicaciones,       meta: { requiresAuth: true } },
    { path: '/usuario/:id/chat',        component: PrivateChat,         meta: { requiresAuth: true } },
];


const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let loggedUser = {
    id: null,
    email: null,
}

subscribeToAuthChanges(newUserData => loggedUser = newUserData);

router.beforeEach((to, from) => {
    
    if(to.meta.requiresAuth && loggedUser.id === null) {
        return {
            path: '/iniciar-sesion'
        };
    }
});

export default router;