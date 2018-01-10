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
  getNormalArticles(state) {
    return state.articles.filter(a => a.visiblity !== 'special')
  },
  getHomeArticles(state) {
    return state.articles.filter(a => a.visiblity === 'default')
  },
  getHomeArticlesByPage(state) {
    return (page) => {
      const OFFSET = 3
      const results = []
      const a = page * OFFSET
      const b = a + OFFSET
      const aa = state.articles.filter(a => a.visiblity !== 'special')
      return aa.slice(a, b)
    }
  },
  getTags(state) {
    const counts = {}
    for (const article of state.articles) {
      const { tags } = article
      for (const tag of tags) {
        if (tag in counts) {
          counts[tag] = counts[tag] + 1
        } else {
          counts[tag] = 1
        }
      }
    }

    const tags = []
    for (const key of Object.keys(counts)) {
      tags.push({
        name: key,
        count: counts[key],
      })
    }
    tags.sort((a, b) => b.count - a.count)
    return tags
  }
}
