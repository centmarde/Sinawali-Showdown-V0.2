<template>
    <div class="display">
      <div v-if="showGlowBorder" class="glow-border"></div>
      <v-dialog v-model="infoDialog" max-width="500px">
        <v-card>
          <v-card-title>Deck Building Instructions</v-card-title>
          <v-card-text>
            <p>Please build a deck of exactly 7 cards before proceeding.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeInfoDialog">Got it!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container>
        <v-row class="d-flex">
          <v-col cols="3" >
            
            <v-card class="sc-container2" elevation="10" :class="{ 'glow-border': showTooltip }">
              <p v-if="!infoDialog && showGlowBorder" class="start-here-text animated">Start here</p>
              <v-container class="cards-display">
                <v-row>
                  <v-col v-for="deck in paginatedDecksWithRandom" :key="deck.id" cols="6">
                    <v-card class="pa-2 cards" @click="deck.isRandom ? fetchRandomCards() : selectDeck(deck)" :data-deck-id="deck.id"
                      :style="cardDisplay(deck.img)" variant="text">
                      <v-tooltip activator="parent" location="end">
                        <div>
                          <strong>{{ deck.title }}</strong>
                          <p>{{ deck.description }}</p>
                        </div>
                      </v-tooltip>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
              <!-- UI guide for card limits -->
              <div class="ui-guide text-center" style="line-height: 1.2;">
                <p><strong>Deck Confirmation Guide:</strong></p>
                <p>Ensure your deck contains:</p>
                <p>1 Special Card</p>
                <p>3 Rare Cards</p>
                <p>3 Common Cards</p>
                <p>Total: 7 Cards</p>
              </div>
              <!-- Progress Bars -->
              <v-btn color="secondary" @click="goBack" style="position: fixed; left: 20px; bottom: 20px; z-index: 20">
                Back
              </v-btn>
              <v-btn v-if="deck.length === 7" color="primary" @click="confirmDeck"
                :disabled="loading"
                style="position: fixed; right: 20px; bottom: 20px; z-index: 20">
                <span v-if="loading">Loading...</span>
                <span v-else>Confirm Deck</span>
              </v-btn>
            </v-card>
          </v-col>
  
          <v-col cols="6">
            <v-row>
              <v-col v-for="card in paginatedCards" :key="card.id" cols="4">
                <div class="pa-2 cards" @click="selectCard(card)" :style="cardDisplay(card.img)">
                  <v-tooltip activator="parent" location="bottom">
                    <div>
                      <strong>{{ card.name }}</strong>
                      <p>{{ card.rarity }}</p>
                    </div>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
  
            <v-btn v-if="currentPage > 1" icon class="arrow-button left-arrow" @click="prevPage">
              <v-icon>mdi-menu-left</v-icon>
            </v-btn>
  
            <v-btn v-if="currentPage < totalPagesCards" icon class="arrow-button right-arrow" @click="nextPage">
              <v-icon>mdi-menu-right</v-icon>
            </v-btn>
          </v-col>
  
          <v-col cols="3">
            
            <v-card class="sc-container" elevation="10">
              <div class="progress-bars">
                <div>
                  <p>Special Cards: {{ specialCards }}/1</p>
                  <v-progress-linear
                    :value="(specialCards / 1) * 100"
                    color="purple"
                    class="progress-bar"
                  ></v-progress-linear>
                </div>
                <div>
                  <p>Rare Cards: {{ rareCards }}/3</p>
                  <v-progress-linear
                    :value="(rareCards / 3) * 100"
                    color="blue"
                    class="progress-bar"
                  ></v-progress-linear>
                </div>
                <div>
                  <p>Common Cards: {{ commonCards }}/3</p>
                  <v-progress-linear
                    :value="(commonCards / 3) * 100"
                    color="green"
                    class="progress-bar"
                  ></v-progress-linear>
                </div>
              </div>
              <v-card-title class="text-center m-0 p-0">Cards on Deck</v-card-title>
              <div class="text-center text-caption pb-3 text-white-50">
                {{ selectedCount }}/7 selected cards
              </div>
  
              <v-card v-for="(card, index) in deck" :key="index" class="sc-item pa-3">
                <v-img :src="card.img" :alt="card.name" cover>
                  <div class="color-overlay"></div>
                </v-img>
  
                <div class="sc-icon">
                  <v-avatar class="bg-white" variant="elevated" image="@/assets/icon/sticks.png" size="60"></v-avatar>
                </div>
  
                <div class="sc-info">
                  <div class="font-weight-bold text-uppercase c-name">
                    {{ card.name }}
                  </div>
                  <div class="text-capitalize font-italic c-rarity">
                    {{ card.rarity }}
                  </div>
                </div>
  
                <div class="btn-container">
                  <v-btn icon @click="openDialog(card)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon small @click="removeCard(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-card>
  
              <v-btn color="secondary" @click="goBack" style="position: fixed; left: 20px; bottom: 20px; z-index: 20">
                Back
              </v-btn>
  
              <v-btn v-if="deck.length === 7" color="primary" @click="confirmDeck"
                :disabled="loading"
                style="position: fixed; right: 20px; bottom: 20px; z-index: 20">
                <span v-if="loading">Loading...</span>
                <span v-else>Confirm Deck</span>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-img :src="selectedCard.img" :alt="selectedCard.name" cover></v-img>
          <v-card-title>{{ selectedCard.name }}</v-card-title>
          <v-card-text>{{ selectedCard.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { supabase } from "@/lib/supabase";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";
  import { useAudioStore } from "@/stores/audioStore";
  import { useAudioAdventure } from "@/stores/adventureAudio";
  import { useDeckValidation } from "@/composables/useDeckValidation";
  
  const cards = ref([]);
  const deck = ref([]);
  const decks = ref([]);
  const toast = useToast();
  const router = useRouter();
  const loading = ref(false);
  const audioStore = useAudioStore();
  const audioAdventure = useAudioAdventure();
  const currentPage = ref(1);
  const cardsPerPage = 9;
  
  const dialog = ref(false);
  const selectedCard = ref({});
  
  const { isDeckValid, validateDeck, validationMessage } = useDeckValidation(deck);
  
  const specialCards = computed(() => deck.value.filter(card => card.rarity === 'special').length);
  const rareCards = computed(() => deck.value.filter(card => card.rarity === 'rare').length);
  const commonCards = computed(() => deck.value.filter(card => card.rarity === 'common').length);
  
  const infoDialog = ref(true);
  
  const showTooltip = ref(false);
  
  const showGlowBorder = ref(true);
  
  onMounted(async () => {
    deckDisplay();
    setTimeout(() => {
        showGlowBorder.value = false;
    }, 5000);
  });
  const deckDisplay = async () => {
    try {
      let { data, error } = await supabase.from("structure_decks").select("*");
      if (error) throw error;
      decks.value = data;
    } catch (err) {
      console.error("Error fetching structure decks:", err.message);
    }
  }
  
  //javascript
  const selectDeck = async (deck) => {
    audioStore.playCardSound();
  
    try {
      let { data: deckData, error: deckError } = await supabase
        .from("decks")
        .select("*")
        .eq("structure_deck_id", deck.id);
  
      if (deckError) {
        throw deckError;
      }
  
      decks.value = deckData;
      const cardIds = decks.value.map(deck => deck.card_id);
  
      let { data: cardData, error: cardError } = await supabase
        .from("cards")
        .select("*")
        .in("id", cardIds);
  
      if (cardError) {
        throw cardError;
      }
  
      cards.value = cardData;
      currentPage.value = 1;
      deckDisplay();
    } catch (err) {
      console.error("Error fetching data for selected deck:", err.message);
      toast.error("Failed to load cards. Please try again.");
    }
  };
  
  
  //postgres functions
  // const selectDeck = async (deck) => {
  //   audioStore.playCardSound();
  //   try {
     
  //     let { data: deckData, error: deckError } = await supabase
  //       .rpc('get_deck_with_cards', { input_deck_id: deck.id });
  
  //     if (deckError) {
  //       throw deckError;
  //     }
  
      
  //     decks.value = deckData;
  
      
  //     const cardIds = deckData.map(item => item.card_id);
  
      
  //     let { data: cardData, error: cardError } = await supabase
  //       .from("cards")
  //       .select("*")
  //       .in("id", cardIds);
  
  //     if (cardError) {
  //       throw cardError;
  //     }
  
     
  //     cards.value = cardData;
  //     currentPage.value = 1;
      
  //     // Call deck display function
  //     deckDisplay();
  
  //   } catch (err) {
  //     console.error("Error fetching data for selected deck:", err.message);
  //     toast.error("Failed to load cards. Please try again.");
  //   }
  // };
  
  
  const selectCard = (card) => {
    audioStore.playCardSound();
    if (deck.value.length < 7 && !deck.value.includes(card)) {
      deck.value.push(card); // Add card to deck if less than 7 cards
      deckDisplay();
    } else if (deck.value.length >= 7) {
      // Show toast if the deck exceeds 7 cards
      toast.error("You exceeded the maximum of 7 cards in your deck.");
    }
  };
  const removeCard = (index) => {
    deck.value.splice(index, 1);
  };
  
  const openDialog = (card) => {
    selectedCard.value = card;
    dialog.value = true;
  };
  
  const cardDisplay = (img) => ({
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "210px",
    width: "170px",
    borderRadius: "8px",
    position: "relative",
    cursor: "pointer",
  });
  
  const selectedCount = computed(() => deck.value.length);
  
  const totalPages = computed(() => Math.ceil(decks.value.length / cardsPerPage));
  
  const paginatedDecks = computed(() => {
    const start = (currentPage.value - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return decks.value.slice(start, end);
  });
  
  const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return cards.value.slice(start, end);
  });
  
  const totalPagesCards = computed(() => Math.ceil(cards.value.length / cardsPerPage));
  
  const nextPage = () => {
    if (currentPage.value < totalPagesCards.value) {
      currentPage.value++;
    }
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const goBack = () => {
    router.push("/select_character");
  };
  
  const startBattle = () => {
    const randomPlayer = Math.random() < 0.5 ? '1' : '2'; // Randomly choose between '1' and '2'
    
    if (randomPlayer === '1') {
        toast(`Player 1 attacks first!`, {
            type: 'success',
            position: 'bottom-left',
            timeout: 3000,
            closeOnClick: true,
        });
        router.push("/battle_area_ai");
    } else {
        toast(`Player 2 attacks first!`, {
            type: 'success',
            position: 'bottom-right',
            timeout: 3000,
            closeOnClick: true,
        });
        router.push("/next_phase_ai");
    }
  };
  
  const confirmDeck = async () => {
    validateDeck();
  
    if (!isDeckValid.value) {
      if (validationMessage.value) {
        toast.info(validationMessage.value); // Use info toast for dynamic feedback
      } else {
        toast.error("You must have exactly 7 cards in your deck to confirm.");
      }
      return;
    }
  
    audioAdventure.playClick();
    const characterId = localStorage.getItem("selectedCharacter");
    const userId = localStorage.getItem("user_id");
    if (!characterId) {
      alert("User is not logged in.");
      return;
    }
  
    loading.value = true;
    try {
    // First, check if the user already has 7 cards in their deck
    const { data: existingDeck, error: fetchDeckError } = await supabase
      .from("deck_builds")
      .select("id")
      .eq("user_id", characterId);
  
    if (fetchDeckError) {
      console.error("Error fetching existing deck:", fetchDeckError);
      return; // Stop if there's an error fetching the user's deck
    }
  
    // If there are 7 cards, prevent further inserts
    if (existingDeck.length >= 7) {
      console.log("A user can only have up to 7 cards in their deck.");
      toast("You can only have 7 cards in your deck.");
      return; // Abort the insert operation if the limit is reached
    }
  
    // Insert new cards only if the user has fewer than 7
    for (const card of deck.value) {
      // Check if the card already exists in the table for the given user
      const { data: existingCards, error: fetchError } = await supabase
        .from("deck_builds")
        .select("id")
        .eq("character_id", userId)
        .eq("card_id", card.id);
  
      if (fetchError) {
        console.error("Error checking for duplicate:", fetchError);
        continue; // Skip this card and move to the next one
      }
  
      // Insert only if the card does not already exist (check if existingCards has no results)
      if (existingCards.length === 0) {
      
        const { error: insertError } = await supabase.from("deck_builds").insert([
          {
            user_id: userId,
            card_id: card.id,
            character_id: characterId,
            temp: 1,
          },
        ]);
  
        if (insertError) {
          console.error("Error inserting card into deck:", insertError);
        } 
      }
    }
  
    toast("Deck has been confirmed!");
    startBattle(); // Call startBattle instead of router.push("/deck_player2");
  } finally {
    loading.value = false; // Set loading to false once done
  }
  
  };
  
  const fetchRandomCards = async () => {
    try {
      let { data: cardData, error } = await supabase
        .from("cards")
        .select("*")
        .neq("id", 91); // Exclude card with id=91
  
      if (error) throw error;
  
      // Shuffle the cards and take the first 9
      cards.value = shuffleArray(cardData).slice(0, 9);
      currentPage.value = 1; // Reset to first page
    } catch (err) {
      console.error("Error fetching random cards:", err.message);
      toast.error("Failed to load random cards. Please try again.");
    }
  };
  
  // Utility function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  const paginatedDecksWithRandom = computed(() => {
    const randomDeck = {
      id: 'random',
      title: 'Random Card',
      description: 'Set of random Cards',
      img: 'https://fahdbotkfakphwjjhgpb.supabase.co/storage/v1/object/public/cards/public/Buff/0_forbidden.png', // Replace with the path to your temporary image
      isRandom: true
    };
    return [...paginatedDecks.value, randomDeck];
  });
  
  const closeInfoDialog = () => {
    infoDialog.value = false;
    showTooltip.value = true;
    setTimeout(() => {
      showTooltip.value = false;
    }, 3400); // Hide tooltip after 5 seconds
  };
  </script>
  
  
  
  
  
  
  <style scoped>
  .display {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-image: url("@/assets/maps/map1Grad.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }
  
  .cards-display {
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .card-title {
    color: #151515;
    position: absolute;
    font-size: 11px;
    top: -0.7rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  
  .arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
  
  .left-arrow {
    left: -30px;
  }
  
  .right-arrow {
    right: -30px;
  }
  
  .sc-container {
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    width: 420px;
    padding: 10px;
    background-color: #151515;
  }
  
  .sc-container2 {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    width: 420px;
    padding: 10px;
    background-color: #151515;
    z-index: 1;
  }
  
  .sc-item {
    margin-bottom: 10px;
    height: 100px;
    position: relative;
  }
  
  .color-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0);
    background: linear-gradient(90deg,
        rgba(0, 0, 0, 1) 20%,
        rgba(0, 0, 0, 0.742734593837535) 60%,
        rgba(0, 0, 0, 0.4906337535014006) 80%,
        rgba(0, 0, 0, 0) 100%);
    z-index: 1;
  }
  
  .btn-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    position: absolute;
    bottom: 25px;
    right: 10px;
    z-index: 3;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .sc-info {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 30px;
    left: 90px;
    z-index: 2;
  }
  
  .sc-icon {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 18px;
    z-index: 2;
  }
  
  .sc-item:hover .btn-container,
  .sc-item:focus .btn-container {
    opacity: 1;
  }
  
  .sc-item:hover v-img,
  .sc-item:focus v-img,
  .sc-item:hover .sc-icon,
  .sc-item:focus .sc-icon,
  .sc-item:hover .sc-info,
  .sc-item:focus .sc-info {
    filter: blur(2px);
  }
  
  .c-name {
    font-size: 14px;
  }
  
  .c-rarity {
    font-size: 12px;
  }
  
  .progress-bar {
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    overflow: hidden;
  }
  
  .progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    animation: progressAnimation 1s ease-in-out;
  }
  
  @keyframes progressAnimation {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
  
  .glow-border {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    border: 2px solid #00ff00;
    box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
    transition: box-shadow 0.3s ease-in-out;
  }
  
  .start-here-text {
    position: fixed;
    z-index: 9999;
    top: 13rem;
    left: 5.5rem;
    font-size: 50px;
    margin-top: 20px;
    color: #00ff00; /* Green color for the text */
    animation: pulse 1.5s infinite; /* Apply the pulse animation */
  }
  
  /* Animation for the "Start here" text */
  @keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
  }
  </style>