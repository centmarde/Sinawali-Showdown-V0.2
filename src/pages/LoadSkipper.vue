<template>
    <v-app class="zoomed">
      <v-main>
        <div v-if="isLoading" class="loading-screen">
          <v-progress-circular
            indeterminate
            color="primary"
            size="50"
          ></v-progress-circular>
          <p>Loading...</p>
        </div>
        <router-view v-else />
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoading: true,
      };
    },
    mounted() {
      // Set a timeout for 3 seconds to navigate back to the previous route
      setTimeout(() => {
        this.isLoading = false;
        this.$router.go(-1); // Navigate back to the previous route
      }, 500); // Adjusted to 3 seconds
    },
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Rock+Salt&display=swap");
  
  .merienda {
    font-family: "Merienda", cursive;
  }
  
  .zoomed {
    transform: scale(1); /* Set default zoom to 125% */
    transform-origin: top left; /* Ensure the zoom starts from the top left */
    overflow: hidden;
  }
  
  .loading-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #e6d011;
    position: absolute;
    width: 100%;
    z-index: 999; /* Ensure the loading screen is above other elements */
    font-family: "Merienda", cursive;
  }
  
  p {
    font-size: 24px;
    margin-top: 16px;
  }
  </style>
  