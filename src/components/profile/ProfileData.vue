<script>
export default {
    name: 'ProfileData',
    props: {
        user: {
            type: Object,
            required: true,
        }
    }
}
</script>

<template>
    <div class="flex gap-2 items-start"> 
        <div class="w-1/4"> 
            <img
                v-if="user.photoURL"
                :src="user.photoURL"
                alt="Foto de perfil"
                class="w-64 h-64 rounded-full object-cover"
            >
            <span v-else>Sin foto de perfil</span>
        </div>
        <div>
            <dt class="font-bold">Sobre mí</dt>
            <div class="mb-2">{{ user.bio || 'Acá va la biografía del usuario...' }}</div> 

            <dl>
                <dt class="font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="font-bold">Nombre de Usuario</dt>
                <dd class="mb-2">{{ user.displayName || 'No especificado...' }}</dd> 
                <dt class="font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career || 'No especificada...' }}</dd> 
            </dl>
        </div>
    </div>
</template>