<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Admin Dashboard</h1>
      </v-col>
    </v-row>

    <!-- Users and Adventures Table -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="userHeaders"
          :items="users"
          item-value="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Users and Adventures</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="fetchUsers">Refresh</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
           
          
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
          <v-col cols="12">
            <v-chip>Total Cards: {{ cards.length }}</v-chip>
            <v-chip>Common: {{ cardCounts.common }}</v-chip>
            <v-chip>Rare: {{ cardCounts.rare }}</v-chip>
            <v-chip>Special: {{ cardCounts.special }}</v-chip>
          </v-col>
        </v-row>
    <!-- Cards Grid -->
    <v-row>
      <v-col cols="12">
        <v-toolbar flat>
          <v-toolbar-title>Card Previews</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="openCardDialog()">Add Card</v-btn>
          <v-btn color="primary" @click="fetchCards">Refresh</v-btn>
        </v-toolbar>
        <v-row>
          <v-col
            v-for="card in cards"
            :key="card.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-img :src="card.img" height="200px"></v-img>
              <v-card-title>{{ card.name }}</v-card-title>
              <v-card-subtitle>{{ card.rarity }}</v-card-subtitle>
              <v-card-text>{{ card.description }}</v-card-text>
              <v-btn small color="info" @click="openCardDialog(card)">Edit</v-btn>
              <v-btn small color="red" @click="confirmDelete(card.id, 'card')">Delete</v-btn>
            </v-card>
          </v-col>
        </v-row>
        
      </v-col>
    </v-row>

    <!-- Edit/Add Dialog -->
    <v-dialog v-model="dialogOpen" max-width="600px">
      <v-card>
        <v-card-title>{{ dialogMode === 'edit' ? 'Edit' : 'Add' }} {{ dialogType }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="dialogData.name"
              label="Name"
              :placeholder="dialogData.name || 'Enter name'"
              required
            ></v-text-field>
            <v-text-field
              v-model="dialogData.description"
              label="Description"
              :placeholder="dialogData.description || 'Enter description'"
            ></v-text-field>
            <v-text-field
              v-if="dialogType === 'card'"
              v-model="dialogData.img"
              label="Image URL"
              :placeholder="dialogData.img || 'Enter image URL'"
            ></v-text-field>
            <v-select
              v-if="dialogType === 'card'"
              v-model="dialogData.rarity"
              :items="rarityOptions"
              label="Rarity"
              :placeholder="dialogData.rarity || 'Select rarity'"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogOpen = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="saveDialogData">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="deleteDialogOpen" max-width="400px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this {{ deleteType }}? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialogOpen = false">Cancel</v-btn>
          <v-btn color="red" text @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { supabase } from '@/lib/supabase';

export default {
  data() {
    return {
      users: [],
      cards: [],
      userHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'User Name', value: 'user_name' },
        { text: 'Adventures', value: 'adventures' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialogOpen: false,
      deleteDialogOpen: false,
      dialogType: '', // 'user' or 'card'
      dialogMode: 'add', // 'add' or 'edit'
      dialogData: {}, // Data for the form in dialog
      deleteType: '', // 'user' or 'card'
      deleteId: null,
      rarityOptions: ['Common', 'Rare', 'Special'],
      cardCounts: {
        common: 0,
        rare: 0,
        special: 0,
      },
      totalCardCount: 0,
    };
  },
  methods: {
    async fetchUsers() {
      const userId = localStorage.getItem("user_id");
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('id, user_name, adventures(id, intro)')
          .neq('id', userId);
        if (error) throw error;
        this.users = users.map((user) => ({
          ...user,
          adventures: user.adventures || [],
        }));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    },

    async fetchCardRarityCounts() {
      try {
        const { data: rarityCounts, error } = await supabase
          .from('card_rarity_counts')
          .select('*');
        if (error) throw error;
        
        // Map the fetched data to the cardCounts object
        this.cardCounts = rarityCounts.reduce((acc, { rarity, count }) => {
          acc[rarity.toLowerCase()] = count;
          return acc;
        }, { common: 0, rare: 0, special: 0 });
      } catch (error) {
        console.error('Failed to fetch card rarity counts:', error);
      }
    },

    async fetchTotalCardCount() {
      try {
        const { data: totalCountData, error } = await supabase
          .from('total_card_count')
          .select('*');
        if (error) throw error;
        
        // Update the total card count
        this.totalCardCount = totalCountData[0]?.total_count || 0;
      } catch (error) {
        console.error('Failed to fetch total card count:', error);
      }
    },

    async fetchCards() {
      try {
        const { data: cards, error } = await supabase.from('cards').select('*');
        if (error) throw error;
        this.cards = cards;
        this.fetchCardRarityCounts(); // Fetch rarity counts from the materialized view
        this.fetchTotalCardCount(); // Fetch total card count from the materialized view
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    },

    openCardDialog(card = null) {
      this.dialogType = 'card';
      this.dialogMode = card ? 'edit' : 'add';
      this.dialogData = card
        ? { ...card }
        : { name: '', description: '', img: '', rarity: '' };
      this.dialogOpen = true;
    },

    async saveDialogData() {
      try {
        if (this.dialogType === 'user') {
          if (this.dialogMode === 'edit') {
            await supabase.from('users').update(this.dialogData).eq('id', this.dialogData.id);
          } else {
            await supabase.from('users').insert([this.dialogData]);
          }
        } else if (this.dialogType === 'card') {
          if (this.dialogMode === 'edit') {
            await supabase.from('cards').update(this.dialogData).eq('id', this.dialogData.id);
          } else {
            await supabase.from('cards').insert([this.dialogData]);
          }
        }
        this.dialogOpen = false;
        this.fetchUsers();
        this.fetchCards();
      } catch (error) {
        console.error('Failed to save:', error);
      }
    },

    confirmDelete(id, type) {
      this.deleteId = id;
      this.deleteType = type;
      this.deleteDialogOpen = true;
    },

    async deleteItem() {
      try {
       
       if (this.deleteType === 'card') {
          await supabase.from('cards').delete().eq('id', this.deleteId);
          this.fetchCards();
        }
        this.deleteDialogOpen = false;
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    },
  },

  mounted() {
    this.fetchUsers();
    this.fetchCards();
  },
};
</script>

<style>
.v-chip {
  display: inline-block;
  margin-right: 8px;
}
</style>


<style>
.v-chip {
  display: inline-block;
}
</style>
