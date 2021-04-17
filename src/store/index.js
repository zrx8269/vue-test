import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      counter: 1
    },
    mutations: {
      add(state) {
        state.counter++
      },
      init(state, counter) {
        state.counter = counter;
      }
    },
    actions: {
      add({commit}) {
        setTimeout(() => {
          commit('add');
        }, 1000)
      },
      getCounter({commit}) {
        return new Promise((resolve) => {
          setTimeout(() => {
            commit('init', Math.random() * 100);
            resolve();
          }, 1000)
        })
      }
    },
    getters: {
      doubleCounter: function(state) {
        return state.counter * 2;
      }
  
    }
  })
} 
