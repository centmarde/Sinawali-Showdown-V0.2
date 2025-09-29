<template>
    <div>
        <KeepAlive :max="10">
       <BattleAi/>
        </KeepAlive>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import BattleAi from '@/components/player-vs-ai/BattleAi.vue';


export default {
    components: {
        BattleAi,
    },
    setup() {
        const audioStore = useAudioStore();

        const activeComponent = ref('BattleAi');
        onMounted(() => {
            audioStore.playAudio();
        });

        return {
            audioStore,
            activeComponent,
        };
    },
};
</script>

<style lang="scss" scoped>
/* Add any additional styling here */
</style>
