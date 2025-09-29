<template>
    <div class="ready-container">
      <h1>Ready!</h1>
      <p>Both players have confirmed their decks. You can now proceed to the next phase.</p>
      <PrimBtn @click="startBattle" :content="'Start Battle'" />
    </div>
  </template>
  
  <script setup>
   import { useRouter } from 'vue-router';
   import PrimBtn from '@/components/buttons/PrimBtn.vue';
   import { useToast } from "vue-toastification";

   const toast = useToast();
   const router = useRouter();
   const selectedCharacter = localStorage.getItem("selectedCharacter");
   console.log(selectedCharacter);

   const startBattle = () => {
       const randomPlayer = Math.random() < 0.5 ? '1' : '2'; // Randomly choose between '1' and '2'
       
       if (randomPlayer === '1') {
           toast(`Player 1 attacks first!`, {
              type: 'success',
              position: 'bottom-left',
              timeout: 3000,
              closeOnClick: true,
            });
          
           router.push("/battle_area");
       } else {
           toast(`Player 2 attacks first!`, {
              type: 'success',
              position: 'bottom-right',
              timeout: 3000,
              closeOnClick: true,
            });
           router.push("/next_phase");
       }
   };
  </script>
  
  <style scoped>
  .ready-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #151515;
    text-align: center;
  }
  </style>