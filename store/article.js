import { Article } from '../models'

export const state = () => ({
  articles: [],
  isFetched: false,
})

export const mutations = {
  setArticles(state, items) {
    state.articles = items.map((a) => new Article(a))
    state.isFetched = true
  },
  wrap(state, items) {
    state.articles = state.articles.map((a) => new Article(a))
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
  specialArticles(state) {
    return state.articles.filter(a => a.visiblity === 'special')
  },
  normalArticles(state) {
    return state.articles.filter(a => a.visiblity !== 'special')
  },
  homeArticles(state) {
    return state.articles.filter(a => a.visiblity === 'default')
  },
  getArticle(state) {
    return (parent, slug) => {
      return state.articles.find(a => a.parent === parent && a.slug === slug)
    }
  },
  getArticlesByParent(state) {
    return (parent) => {
      return state.articles.filter(a => {
        if (!['default'].includes(a.visiblity)) {
          return false
        }
        return a.parent === parent
      })
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
    tags.sort((a, b) => {
      const diff = b.count - a.count
      if (diff !== 0) {
        return diff
      }
      return a.name.localeCompare(b.name)
    })
    return tags
  }
}
