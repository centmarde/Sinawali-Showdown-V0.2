<template>
  <div class="fill-height bg">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-img
            class="mx-auto mt-16"
            width="40%"
            src="../assets/logo.png"
          ></v-img>
        </v-col>

        <v-col cols="12" class="text-center">
          <h2 class="my-5 font-weight-bold text-black">
            Please make sure you are connected to the Internet.
          </h2>
        </v-col>

        <v-col cols="12" class="d-flex justify-center align-center">
          <RouterLink to="/">
            <PrimeBtn
              content="Click Here to Continue!"
              width="300px"
              height="50px"
              marginLeft="8px"
            />
          </RouterLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PrimeBtn from "@/components/buttons/PrimBtn.vue";
export default {
  components: {
    PrimeBtn,
  },
};
</script>

<style scoped>
.bg {
  background-color: #e6d011;
}
</style>
