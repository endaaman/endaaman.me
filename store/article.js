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
  getDefaultArticles(state) {
    return state.articles.filter(a => a.visiblity === 'default')
  },
  getTags() {
    const counts = {}
    // for (const article of state.articles) {
    //   const { tags } = article
    //   for (const tag of tags) {
    //     if (tag in counts) {
    //       counts[tag] = counts[tag] + 1
    //     } else {
    //       counts[tag] = 1
    //     }
    //   }
    // }

    counts['hoge'] = 2

    const tags = []
    for (const key of Object.keys(counts)) {
      tags.push({
        name: key,
        count: counts[key],
      })
    }
    return tags
  }
}
