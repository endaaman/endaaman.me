export const state = () => ({
  isSidebarActive: false,
  isSmallScreen: false,
})

export const mutations = {
  setIsSidebarActive(state, flag) {
    state.isSidebarActive = flag
  },
  setIsSmallScrern(state, flag) {
    state.isSmallScreen = flag
  },
}

export const actions = {
  closeSidebar({ commit }) {
    commit('setIsSidebarActive', false)
  },
  openSidebar({ commit }) {
    commit('setIsSidebarActive', true)
  },
  setIsSmallScrern({ commit }, flag) {
    commit('setIsSmallScrern', flag)
  },
}
