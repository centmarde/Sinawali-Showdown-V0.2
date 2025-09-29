import { ref } from "vue";

export const useDeckValidation = (deck) => {
  const isDeckValid = ref(false);
  const validationMessage = ref("");

  const validateDeck = () => {
    const specialCards = deck.value.filter(
      (card) => card.rarity === "special"
    ).length;
    const rareCards = deck.value.filter(
      (card) => card.rarity === "rare"
    ).length;
    const commonCards = deck.value.filter(
      (card) => card.rarity === "common"
    ).length;

    let message = [];
    if (specialCards > 1) message.push(`Special cards: ${specialCards}/1`);
    if (rareCards > 3) message.push(`Rare cards: ${rareCards}/3`);
    if (commonCards > 3) message.push(`Common cards: ${commonCards}/3`);

    if (message.length > 0) {
      validationMessage.value = `Exceeded limits: ${message.join(", ")}`;
      isDeckValid.value = false;
    } else {
      validationMessage.value = "";
      isDeckValid.value = deck.value.length === 7;
    }
  };

  return { isDeckValid, validateDeck, validationMessage };
};
