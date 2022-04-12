import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breadList: ['card']
  },
  mutations: {
    updateBreadList (state, breadList) {
      state.breadList = breadList
    }
  },
  actions: {
    //
  },
  modules: {
      //
  }
})