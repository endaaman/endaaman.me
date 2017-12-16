export const state = () => ({
  categories: [],
  isFetched: false,
})

export const mutations = {
  setCategories(state, items) {
    state.categories = items
    state.isFetched = true
  },
}

export const actions = {
  async fetchCategories({ commit, getters, rootGetters }) {
    const { data } = await rootGetters.api.get('/categories')
    commit('setCategories', data)
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
}
