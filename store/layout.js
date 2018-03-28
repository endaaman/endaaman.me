export const state = () => ({
  isSidebarActive: false,
  isSmallScreen: true,
  isSizeCalculated: false,
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
  setIsSizeCalculated(state, flag) {
    state.isSizeCalculated = flag
  },

  setActiveArticle(state, article) {
    state.activeArticle = article
  },
  setActiveTag(state, tag) {
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
  toggleSidebar({ commit, state }) {
    commit('setIsSidebarActive', !state.isSidebarActive)
  },
  setIsSmallScreen({ commit }, flag) {
    commit('setIsSmallScreen', flag)
  },
  setIsSizeCalculated({ commit }, flag) {
    commit('setIsSizeCalculated', flag)
  },
  setActiveArticle({ commit }, article) {
    commit('setActiveArticle', article)
  },
  setActiveTag({ commit }, tag) {
    commit('setActiveTag', tag)
  },
  setActiveCategory({ commit }, category) {
    commit('setActiveCategory', category)
  },
}
