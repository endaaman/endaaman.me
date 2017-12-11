import axios from 'axios'
import cookieParser from 'cookie'
import browserCookie from 'browser-cookies'

function isClient() {
  return typeof window !== 'undefined'
}

export const state = () => ({
  articles: [],
  isFetched: false,
})

export const mutations = {
  setArticles(state, items) {
    state.articles = items
  },
  clearArticles(state, items) {
    state.articles = []
  },
  setIsFetched(state, flag) {
    state.isFetched = flag
  },
}

export const actions = {
  async fetchArticles({ commit, getters, rootGetters }) {
    const { data } = await rootGetters.api.get('/articles')
    commit('setArticles', data)
    commit('setIsFetched', true)
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
      return state.articles.find(article => article.slug === slug)
    }
  },
  getSpecialArticles(state) {
    return (slug) => {
      return state.articles.filter(article => article.visiblity === 'special')
    }
  }
}
