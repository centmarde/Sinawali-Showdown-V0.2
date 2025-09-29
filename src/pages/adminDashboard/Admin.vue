<template>
  <v-app class="bg-grey-darken-4">
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      :expand-on-hover="expandOnHover"
      permanent
      @click="handleDrawerClick"
      color="grey-darken-4"
    >
      <v-list class="mt-1">
        <v-list-item :prepend-avatar="logo"
          ><strong class="text-h5 font-weight-black"
            >SINAWALI</strong
          ></v-list-item
        >
      </v-list>

      <!-- Dashboard -->
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          class="mb-2"
          :class="{ 'active-tab': activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        ></v-list-item>

        <!-- Users -->
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Users"
          value="users"
          class="mb-2"
          :class="{ 'active-tab': activeTab === 'users' }"
          @click="activeTab = 'users'"
        ></v-list-item>

        <!-- Cards -->
        <v-list-item
          prepend-icon="mdi-card-bulleted"
          title="Cards"
          value="cards"
          class="mb-2"
          :class="{ 'active-tab': activeTab === 'cards' }"
          @click="activeTab = 'cards'"
        ></v-list-item>

        <!-- Adventure -->
        <v-list-item
          prepend-icon="mdi-map-marker"
          title="Adventure"
          value="adventure"
          class="mb-2"
          :class="{ 'active-tab': activeTab === 'adventure' }"
          @click="activeTab = 'adventure'"
        ></v-list-item>

        <!-- Rooms -->
        <v-list-item
          prepend-icon="mdi-door"
          title="Rooms"
          value="rooms"
          class="mb-2"
          :class="{ 'active-tab': activeTab === 'rooms' }"
          @click="activeTab = 'rooms'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="grey-darken-4 px-3">
      <v-app-bar-nav-icon
        @click.stop="toggleRail"
        :style="navIconStyle"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- Notification Icon with Badge -->
      <v-btn size="x-small" variant="tonal" icon class="mr-3" color="#e6d011">
        <v-badge color="red" dot>
          <v-icon color="white">mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Settings -->
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            rounded="xl"
            size="large"
            variant="tonal"
            v-bind="props"
            color="#e6d011"
          >
            <v-avatar size="25" class="mr-2">
              <v-img src="@/assets/slogo.png"></v-img>
            </v-avatar>
            <v-icon color="white">mdi-cog</v-icon>
          </v-btn>
        </template>

        <v-sheet class="pa-0 mt-2 me-1 menu-card" color="grey-darken-3">
          <div class="text-h6 font-weight-bold">User Settings</div>
          <v-divider class="mb-0"></v-divider>
          <div>
            <v-btn
              class="justify-start"
              rounded="0"
              variant="text"
              size="large"
              block
              @click="handleProfileClick"
              style="text-transform: none"
            >
              <v-row align="center" no-gutters>
                <v-col cols="auto">
                  <v-icon class="me-3" left>mdi-account</v-icon>
                </v-col>
                <v-col> Profile </v-col>
              </v-row>
            </v-btn>
            <v-btn
              class="justify-start"
              rounded="0"
              variant="text"
              size="large"
              block
              @click="handleSettingsClick"
              style="text-transform: none"
            >
              <v-row align="center" no-gutters>
                <v-col cols="auto">
                  <v-icon class="me-3" left>mdi-cog</v-icon>
                </v-col>
                <v-col> Settings </v-col>
              </v-row>
            </v-btn>
            <v-btn
              class="justify-start"
              rounded="0"
              variant="text"
              size="large"
              block
              @click="handleLogoutClick"
              style="text-transform: none"
            >
              <v-row align="center" no-gutters>
                <v-col cols="auto">
                  <v-icon class="me-3" left>mdi-logout</v-icon>
                </v-col>
                <v-col> Logout </v-col>
              </v-row>
            </v-btn>
          </div>
        </v-sheet>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <AdminBase v-if="activeTab === 'dashboard'" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import logo from "@/assets/slogo.png";
import AdminBase from "@/components/Admin/AdminBase.vue";

const drawer = ref(true);
const rail = ref(true);
const expandOnHover = ref(true);
const activeTab = ref(localStorage.getItem("activeTab") || "dashboard"); // Default active tab

const toggleRail = () => {
  rail.value = !rail.value;
  expandOnHover.value = rail.value;
};

const handleDrawerClick = () => {
  rail.value = false;
  expandOnHover.value = false;
};

watch(rail, (newVal) => {
  expandOnHover.value = newVal;
});

const navIconStyle = computed(() => ({
  //   backgroundColor: rail.value ? "transparent" : "rgba(205, 188, 38, 0.167", // Adjust the rgba value for the desired tonal effect
  borderRadius: "50%", // Optional: to make the background color circular
  padding: "8px", // Optional: to add some padding around the icon
}));

const handleProfileClick = () => {
  console.log("Profile clicked");
};

const handleSettingsClick = () => {
  console.log("Settings clicked");
};

const handleLogoutClick = () => {
  console.log("Logout clicked");
};

// Watch for changes in activeTab and save it to local storage
watch(activeTab, (newTab) => {
  localStorage.setItem("activeTab", newTab);
});
</script>

<style scoped>
.menu-card {
  width: 250px;
  padding: 0 !important;
}

.active-tab {
  background-color: #39361f !important;
}

:deep(.v-navigation-drawer--left) {
  border-right-width: none !important;
  border-right: none !important;
  color: rgba(205, 188, 38, 0.167);
}

/* Override Vuetify styles */
:deep(.v-list-item--active > .v-list-item__overlay),
:deep(
    .v-list-item[aria-haspopup="menu"][aria-expanded="true"]
      > .v-list-item__overlay
  ) {
  opacity: 0 !important;
  display: none !important;
}
</style>
