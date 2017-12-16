export const state = () => ({
  articles: [],
  isFetched: false,
})

export const mutations = {
  setArticles(state, items) {
    state.articles = items
    state.isFetched = true
  },
}

export const actions = {
  async fetchArticles({ commit, getters, rootGetters }) {
    const { data } = await rootGetters.api.get('/articles')
    commit('setArticles', data)
  },
  async getArticles({ state, dispatch }) {
    if (state.isFetched) {
      return
    }
    await dispatch('fetchArticles')
  },
}

export const getters = {
  hasArticles(state) {
    return state.articles.length > 0
  },
  findArticle(state) {
    return (slug) => {
      return state.articles.find(a => a.slug === slug)
    }
  },
  getSpecialArticles(state) {
    return state.articles.filter(a => a.visiblity === 'special')
  },
  getHomeArticles(state) {
    return state.articles.filter(a => a.visiblity === 'public')
  }
}
