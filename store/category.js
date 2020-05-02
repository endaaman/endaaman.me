import { Category } from '../models'

export const state = () => ({
  categories: [],
  isFetched: false,
})

export const mutations = {
  setCategories(state, items) {
    state.categories = items
    state.isFetched = true
  },
  wrap(state, items) {
    state.categories = state.categories.map((a) => new Category(a))
  },
}

export const actions = {
  async fetchCategories({ commit, getters, rootGetters }) {
    const res = await rootGetters.api('/categories')
    commit('setCategories', await res.json())
  },
  async getCategories({ state, dispatch }) {
    if (state.isFetched) {
      return
    }
    await dispatch('fetchCategories')
  },
}

export const getters = {
  findCategory(state) {
    return (slug) => {
      return state.categories.find(c => c.slug === slug)
    }
  },
  getCategoryBySlug(state) {
    return (slug) => {
      return state.categories.find(c => c.slug === slug)
    }
  },
}
