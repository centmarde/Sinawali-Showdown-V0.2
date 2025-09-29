// stores/useCardStore.js
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase"; // Assuming you have supabaseClient configured

export const useSpecificCards = defineStore("SpecificCards", {
  state: () => ({
    refresher: null, // Store for refresher card
    error: null, // Store for any errors
  }),

  actions: {
    // Fetch a card by its ID
    async fetchCardById(cardId) {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", cardId)
        .single(); // Ensures only a single card is fetched

      if (error) {
        this.error = error;
        console.error("Error fetching card:", error);
        return null;
      }
      return data; // Return the card data
    },
  },
});
