import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hp: -1,
    hpMax: -1,
    gold: -1,
    energy: -1,
    cards: [],
    potions: [],
    relics: [],
    json: {}
  },
  mutations: {
    setGameData (state, data) {
      state.json = data
      state.hp = data.current_health
      state.hpMax = data.max_health
      state.gold = data.gold
      state.energy = data.red
      state.cards = data.cards
      state.potions = data.potions
      state.relics = data.relics
    },
    updateGameData (state, payload) {
      state.json.current_health = parseInt(payload.hp)
      state.json.max_health = parseInt(payload.hpMax)
      state.json.gold = parseInt(payload.gold)
      state.json.red = parseInt(payload.energy)
      state.json.cards = payload.cards
      state.json.potions = payload.potions
      state.json.relics = payload.relics
    }
  }
})
