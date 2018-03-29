<style scoped lang="scss">
@import "../../css/variables";

.file-filename {
  font-family: $family-monospace;
}
</style>

<template lang="pug">
.container-admin-file
  .notification.is-danger(v-if="errorMessage")
    button.delete(@click="errorMessage = ''")
    div(v-html="errorMessage")

  ul.list-inline
    li
      button.button.is-small.is-info(
        @click="reload",
        :class="{ 'is-loading': isReloading }",
      ) Reload
    li
      input(type="file" ref="fileInput" @change.prevent="onSelectUploadings" multiple style="display: none")
      button.button.is-small.is-success(v-if="uploadings.length === 0" @click="selectUploadings") Select files
      button.button.is-small.is-success(v-else @click="uploadFiles") Upload!

    li(v-if="selectedFiles.length > 0") ・

    li(v-if="selectedFiles.length === 1")
      button.button.is-small.is-primary(@click="moveFile") Move

    li(v-if="selectedFiles.length > 0")
      button.button.is-small.is-danger(
        @click="deleteFiles",
        :class="{ 'is-loading': isDeleting }",
      ) Delete

  .tags(v-if="uploadings.length > 0")
    .tag(v-for="u in uploadings", :key="u.name")
      | {{ u.name }}&nbsp;&nbsp;
      button.delete.is-small(@click="unselectUploading(u)")

  nav.breadcrumb.is-small(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/admin/file") Root
      li(v-for="c in crumbs")
        nuxt-link(:to="'/admin/file?q=' + c.dir") {{ c.name }}
      li

  table.table.is-fullwidth
    thead
      tr
        th(width="40px")
        th(width="200px") name
        th(width="120px") size
        th.is-hidden-touch mtime
    tbody
      tr(v-for="file in files")
        td
          b-checkbox(v-model="selectedFiles", :native-value="file.name")
        td.file-filename
          template(v-if="file.is_dir")
            nuxt-link(:to="buildSubLink(file.name)") {{ file.name }}
            span &nbsp;/
          template(v-else)
            span {{ file.name }}
        td {{ formatByteSize(file.size) }}
        td.is-hidden-touch {{ formatTime(file.mtime) }}

</template>

<script>
import fecha from 'fecha'
import { mapState } from 'vuex'

async function fetch(store, route) {
  const dir = route.query.q || ''
  await store.dispatch('file/getFiles', { dir })
}

export default {
  layout: 'simple',
  async fetch ({ store, route }) {
    await fetch(store, route)
  },
  updated() {
    fetch(this.$store, this.$route)
  },
  data: () => ({
    errorMessage: '',
    isReloading: false,
    isDeleting: false,
    isUploading: false,
    selectedFiles: [],
    uploadings: [],
  }),
  computed: {
    parentLink() {
      const dir = this.$route.query.q
      if (!dir) {
        return '/admin/file'
      }
      const splitted = dir.split('/')
      splitted.pop()
      if (splitted.length === 0) {
        return '/admin/file'
      }
      return '/admin/file?q=' + splitted.join('/')
    },
    isRoot() {
      return !this.$route.query.q
    },
    files() {
      return this.$store.getters['file/findFiles'](this.$route.query.q || '')
    },
    crumbs() {
      const dir = this.$route.query.q
      if (!dir) {
        return []
      }
      let prev = ''
      const items = []
      for (const path of dir.split('/')) {
        const cur = prev + path
        items.push({
          name: path,
          dir: cur,
        })
        prev = cur + '/'
      }
      return items
    }
  },
  methods: {
    async reload() {
      this.isReloading = true
      const dir = this.$route.query.q || ''
      await this.$store.dispatch('file/fetchFiles', { dir })
      this.isReloading = false
    },
    moveFile() {
    },
    selectUploadings() {
      this.$refs.fileInput.click()
    },
    onSelectUploadings(e) {
      const files = [ ...e.target.files ]
      this.uploadings = this.uploadings.concat(files)
    },
    unselectUploading(u) {
      this.uploadings = this.uploadings.filter(uu => uu !== u)
    },
    async uploadFiles() {
      const dir = this.$route.query.q || ''
      this.isUploading = true
      const { error } = await this.$store.dispatch('file/uploadFiles', { dir, files: this.uploadings })
      this.isUploading = false
      this.uploadings = []
      if (error) {
        this.errorMessage = error
      } else {
        this.$toast.open({
          message: 'Uploaded files',
          position: 'is-bottom',
        })
      }
    },
    async deleteFiles() {
      const dir = this.$route.query.q || ''
      this.isDeleting = true
      const wg = this.selectedFiles.map(async name => {
        return await this.$store.dispatch('file/deleteFile', { dir, name })
      })
      const errors = await Promise.all(wg)
      this.selectedFiles = []
      this.isDeleting = false
      if (errors.some(e => e.error)) {
        this.errorMessage = errors.filter(e => e.error).map(e => `<li>${e.error}<li>`).join('')
      } else {
        this.$toast.open({
          message: 'Deleted file(s)',
          position: 'is-bottom',
        })
      }
    },
    buildSubLink(dirName) {
      const dir = this.$route.query.q
      let suffix
      if (!dir) {
        suffix = dirName
      } else {
        suffix = dir + '/' + dirName
      }
      return '/admin/file?q=' + suffix
    },
    formatTime(time) {
      return fecha.format(new Date(time), 'YYYY年MM月DD日 HH時mm分')
    },
    formatByteSize(size, precision = 1) {
      if (isNaN(parseFloat(size)) || !isFinite(size)) {
        return '-'
      }
      const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
      const number = size === 0
        ? 0
        : Math.floor(Math.floor(Math.log(size)) / Math.log(1024))
      return (size / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number]
    },
  }
}
</script>
