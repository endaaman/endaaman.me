import axios from 'axios'

// export const namespaced = true

export const state = () => ({
  tree: {},
})

export const mutations = {
  SET_FILES(state, [ dir, files ]) {
    state.tree = {
      ...state.tree,
      [dir]: files,
    }
  },
  DELETE_FILE(state, [ dir, name ]) {
    state.tree = {
      ...state.tree,
      [dir]: state.tree[dir].filter(file => file.name !== name),
    }
  },
}

export const actions = {
  async fetchFiles({ commit, getters, rootGetters }, { dir }) {
    dir = dir || ''
    const { data } = await rootGetters.api.get('files/' + dir)
    commit('SET_FILES', [ dir, data ])
  },
  async getFiles({ commit, getters, dispatch }, { dir }) {
    dir = dir || ''
    if (getters.hasFiles(dir)) {
      return
    }
    await dispatch('fetchFiles', { dir })
  },
  async deleteFile({ commit, dispatch, rootGetters }, { dir, name }) {
    let error = null
    try {
      await rootGetters.api.delete('files/' + (dir ? `${dir}/${name}` : name))
      commit('DELETE_FILE', [ dir, name ])
    } catch (e) {
      error = e.message
    }
    return { error }
  },
  async uploadFiles({ commit, dispatch, rootGetters }, { dir, files }) {
    const fd = new FormData()
    let error = null
    for (const file of files) {
      // NOTE: force lower case
      fd.append(file.name.toLowerCase(), file)
    }
    try {
      const path = '/files' + (dir ? `/${dir}` : '')
      const { data } = await rootGetters.api.post(path, fd, {
        timeout: 10 * 60 * 1000,  // 10min
      })
    } catch (e) {
      error = e.message
      return { error }
    }
    await dispatch('fetchFiles', { dir })
    return { error }
  },
}

export const getters = {
  hasFiles(state) {
    return dir => dir in state.tree
  },
  findFiles(state) {
    return dir => state.tree[dir]
  },
}
