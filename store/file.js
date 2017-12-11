import axios from 'axios'

// export const namespaced = true

export const state = () => ({
  tree: {},
})

export const mutations = {
  setFiles(state, [ slug, files ]) {
    state.tree[slug] = files
  }
}

export const actions = {
  async fetchFiles({ commit, getters, rootGetters }, { slug }) {
    slug = slug || ''
    const { data } = await rootGetters.api.get('files/' + slug)
    commit('setFiles', [ slug, data ])
  },

  async getFiles({ commit, getters, dispatch }, { slug }) {
    slug = slug || ''
    if (getters.hasFiles(slug)) {
      return
    }
    await dispatch('fetchFiles', { slug })
  }
}

export const getters = {
  hasFiles(state) {
    return slug => slug in state.tree
  },
  findFiles(state) {
    return slug => state.tree[slug]
  },
}
