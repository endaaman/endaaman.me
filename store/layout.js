export const state = () => ({
  isSidebarActive: false,
  isSmallScreen: false,
  activeArticle: null,
  activeCategory: null,
  activeTag: null,
})

export const mutations = {
  setIsSidebarActive(state, flag) {
    state.isSidebarActive = flag
  },
  setIsSmallScreen(state, flag) {
    state.isSmallScreen = flag
  },
  setActiveArticle(state, article) {
    state.activeArticle = article
  },
  setActiveTap(state, tap) {
    state.activeTag = tag
  },
  setActiveCategory(state, category) {
    state.activeCategory = category
  },
}

export const actions = {
  closeSidebar({ commit }) {
    commit('setIsSidebarActive', false)
  },
  openSidebar({ commit }) {
    commit('setIsSidebarActive', true)
  },
  setIsSmallScreen({ commit }, flag) {
    commit('setIsSmallScreen', flag)
  },
  setActiveArticle({ commit }, article) {
    commit('setActiveArticle', article)
  },
  setActiveTap({ commit }, tag) {
    commit('setActiveArticle', tag)
  },
  setActiveCategory({ commit }, category) {
    commit('setActiveCategory', category)
  },
}
