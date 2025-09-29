<template>
    <div @click="playAudioOnInteraction">
        <KeepAlive :max="10">
            <component :is="activeComponent" />
        </KeepAlive>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import battle from '@/components/battle_page/battle.vue';

export default {
    components: {
        battle,
    },
    setup() {
        const audioStore = useAudioStore();
        const hasInteracted = ref(false);

        const playAudioOnInteraction = () => {
            if (!hasInteracted.value) {
                audioStore.playAudio();
                hasInteracted.value = true; // Ensure audio only plays once per page load
            }
        };

        // Assuming activeComponent is a dynamic reference to the component name
        const activeComponent = ref('battle'); // This could be dynamically set based on your app logic

        return {
            playAudioOnInteraction,
            activeComponent,
        };
    },
};
</script>

<style lang="scss" scoped>
/* Add any additional styling here */
</style>
