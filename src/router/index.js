/**
 * router/index.ts
 *
 * Combined automatic routes for `./src/pages/*.vue` with role-based authentication guards
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";
import { useToast } from "vue-toastification";

import Hero from "@/pages/index.vue";
import NotFound from "@/pages/NotFound.vue";
import Test from "@/pages/Test.vue";
import CharacterSelection from "@/pages/CharacterSelection.vue";
import CharacterSelectionAi from "@/pages/CharacterSelectionAi.vue";
import BattleArea from "@/pages/battle_area.vue";
import BattleAreaAi from "@/pages/BattleAreaAi.vue";
import NextPhase from "@/components/battle_page/next_phase.vue";
import NextPhaseAi from "@/components/player-vs-ai/NextPhaseAi.vue";
import Victory from "@/pages/Victory.vue";
import Cards from "@/pages/CardsView.vue";
import Landing from "@/pages/Landing.vue";
import MultiPlayer from "@/pages/MultiPlayer.vue";
import OnlineBase from "@/pages/OnlineBase.vue";
import DeckBuild from "@/components/DeckBuild.vue";
import StoryBase from "@/pages/AdventurePages/StoryBase.vue";
import StoryIntro from "@/pages/AdventurePages/StoryIntro.vue";
import StoryCharacter from "@/pages/AdventurePages/StoryCharacter.vue";
import AdBattle from "@/pages/AdBattle.vue";
import NextPhaseAd from "@/components/AdBattlePage/NextPhaseAd.vue";
import ResultBase from "@/pages/AdventurePages/ResultBase.vue";
import Save from "@/pages/AdventurePages/Save.vue";
import BustedBase from "@/pages/BustedBase.vue";
import Store from "@/pages/AdventurePages/Store.vue";
import Reward from "@/pages/AdventurePages/Reward.vue";
import Jail from "@/pages/AdventurePages/Jail.vue";
import LoadSkipper from "@/pages/LoadSkipper.vue";
import WelcomeDesktop from "@/pages/WelcomeDesktop.vue";
import Lander from "@/pages/Lander.vue";
import StructureDeck from "@/components/DeckChoose/StructureDeck.vue";
import StructureDeck2 from "@/components/DeckChoose/StructureDeck2.vue";
import StructureDeckAi from "@/components/DeckChoose/StructureDeckAi.vue";
import Admin from "@/pages/adminDashboard/Admin.vue";
import ReadyComponent from "@/pages/ReadyComponent.vue";

const toast = useToast();

// Setup routes
const routes = setupLayouts([
  ...autoRoutes,

  { path: "/", component: Hero, name: "Hero" },
  { path: "/Test", component: Test },
  { path: "/lander", component: Lander },
  {
    path: "/landing",
    component: Landing,
    name: "landing",
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: Admin,
    name: "admin",
    meta: { requiresAuth: true },
  },
  {
    path: "/structure_deck",
    component: StructureDeck,
    name: "structure_deck",
    meta: { requiresAuth: true },
  },
  {
    path: "/select_character",
    component: CharacterSelection,
    meta: { requiresAuth: true },
  },
  {
    path: "/select_character_ai",
    component: CharacterSelectionAi,
    meta: { requiresAuth: true },
  },
  {
    path: "/next_phase",
    component: NextPhase,
    meta: { requiresAuth: true },
    name: "next_phase",
  },
  {
    path: "/next_phase_ai",
    component: NextPhaseAi,
    meta: { requiresAuth: true },
    name: "next_phase_ai",
  },
  {
    path: "/battle_area",
    component: BattleArea,
    meta: { requiresAuth: true },
    name: "battle_area",
  },
  {
    path: "/battle_area_ai",
    component: BattleAreaAi,
    meta: { requiresAuth: true },
    name: "battle_area_ai",
  },
  {
    path: "/victory",
    component: Victory,
    meta: { requiresAuth: true },
    name: "Victory",
    props: true,
  },
  { path: "/cards", component: Cards, meta: { requiresAuth: true } },
  {
    path: "/multiplayer",
    component: MultiPlayer,
    meta: { requiresAuth: true },
  },
  {
    path: "/OnlineBase",
    component: OnlineBase,
    meta: { requiresAuth: true },
  },
  {
    path: "/deck_build",
    component: DeckBuild,
    meta: { requiresAuth: true },
  },
  {
    path: "/story_base",
    component: StoryBase,
    meta: { requiresAuth: true },
    name: "story_base",
  },
  {
    path: "/story_intro",
    component: StoryIntro,
    meta: { requiresAuth: true },
    name: "story_intro",
  },
  {
    path: "/story_character",
    component: StoryCharacter,
    meta: { requiresAuth: true },
    name: "story_character",
  },
  {
    path: "/ad_battle",
    component: AdBattle,
    meta: { requiresAuth: true },
    name: "ad_battle",
  },
  {
    path: "/next_phase_ad",
    component: NextPhaseAd,
    meta: { requiresAuth: true },
    name: "next_phase_ad",
  },
  {
    path: "/result_base",
    component: ResultBase,
    meta: { requiresAuth: true },
    name: "result_base",
  },

  {
    path: "/defeated",
    component: BustedBase,
    meta: { requiresAuth: true },
    name: "defeated",
  },
  {
    path: "/save",
    component: Save,
    meta: { requiresAuth: true },
    name: "save",
  },
  {
    path: "/reward",
    component: Reward,
    meta: { requiresAuth: true },
    name: "reward",
  },
  {
    path: "/jail",
    component: Jail,
    meta: { requiresAuth: true },
    name: "jail",
  },
  {
    path: "/store",
    component: Store,
    meta: { requiresAuth: true },
    name: "store",
  },
  {
    path: "/wait",
    component: LoadSkipper,
    name: "wait",
  },
  { path: "/:catchAll(.*)", component: WelcomeDesktop, name: "Welcome" },
  {
    path: "/deck_player2",
    component: StructureDeck2,
    meta: { requiresAuth: true },
    name: "deck_player2",
  },
  {
    path: "/ready",
    component: ReadyComponent,
    meta: { requiresAuth: true },
    name: "ready",
  },
  {
    path: "/structure_deck_ai",
    component: StructureDeckAi,
    meta: { requiresAuth: true },
    name: "structure_deck_ai",
  },
]);

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = JSON.parse(localStorage.getItem("Role"));
  console.log(userRole);
  const hasVisitedDashboard =
    JSON.parse(localStorage.getItem("hasVisitedDashboard")) || false;

  // Define public and protected pages
  const publicPages = ["/", "lander"];
  const protectedPages = [
    "/select_character",
    "/structure_deck",
    "/next_phase",
    "/battle_area",
    "/victory",
    "/cards",
    "/landing",
    "/multiplayer",
    "/OnlineBase",
    "/select_character_ai",
    "/next_phase_ai",
    "/battle_area_ai",
    "/deck_build",
    "/story_base",
    "/story_character",
    "/story_intro",
    "/ad_battle",
    "/next_phase_ad",
    "/result_base",
    "/save",
    "/defeated",
    "/reward",
    "/jail",
    "/store",
    "/admin",
    "/structure_deck_ai",
  ];
  /* const nestedProtectedGroup = ["/online_character_select"]; */

  // Redirect to login if accessing protected pages without authentication
  if (protectedPages.includes(to.path) && !isLoggedIn) {
    return next("/");
  }

  // Prevent navigation away from the nested protected group with a toast message
  // if (
  //   nestedProtectedGroup.includes(from.path) &&
  //   !nestedProtectedGroup.includes(to.path)
  // ) {
  //   toast.error(
  //     "Bravery isn't about never feeling fear; it's about facing it and pushing through. You’ve got more courage inside you than you realize—finish this battle first, cutie",
  //     {
  //       timeout: 10000, // 10 seconds
  //     }
  //   );
  //   return next(false); // Cancel the navigation
  // }

  // Redirect to /landing if already logged in and accessing public pages
  if (publicPages.includes(to.path) && isLoggedIn) {
    return next("/landing");
  }

  if (isLoggedIn && userRole === true && !hasVisitedDashboard) {
    localStorage.setItem("hasVisitedDashboard", true);
    return next("/admin");
  }

  if (publicPages.includes(to.path) && isLoggedIn) {
    return next("/landing");
  }

  if (to.path.startsWith("/Admin") && userRole !== true) {
    alert("You do not have permission to access this page.");
    return next("/landing");
  }

  // Default: proceed to the requested route
  next();
});

// Handle dynamic import errors (workaround for https://github.com/vitejs/vite/issues/11804)
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
