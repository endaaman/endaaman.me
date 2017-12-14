<style scope lang="scss">
@import "../css/variables";

.file-filename {
  font-family: $family-monospace;
}

.file-control {
  @include clearfix
  margin: 8px 0;
  li {
    float: left;
    margin-right: 8px;
  }
}
</style>

<template lang="pug">
.container-file
  nav.breadcrumb.is-small(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/") Home
      li
        nuxt-link(to="/file") File Management
      li(v-for="c in crumbs")
        nuxt-link(:to="'/file?q=' + c.dir") {{ c.name }}

  .notification.is-danger(v-if="errorMessage")
    button.delete(@click="errorMessage = ''")
    div(v-html="errorMessage")

  ul.file-control
    li
      nuxt-link.button.is-small(:to="parentLink" :disabled="isRoot") Parent dir
    li
      button.button.is-small.is-info(
        @click="reload",
        :class="{ 'is-loading': isReloading }",
      ) Reload
    li
      input(type="file" ref="fileInput" @change.prevent="onSelectUploadingFiles" multiple style="display: none")
      button.button.is-small.is-success(@click="selectUploadingFiles") Upload..
    li
      button.button.is-small.is-primary(@click="moveFile" :disabled="selectedFiles.length !== 1") Move
    li
      button.button.is-small.is-danger(
        @click="deleteFiles",
        :class="{ 'is-loading': isDeleting }",
        :disabled="selectedFiles.length === 0",
      ) Delete

  .tags(v-if="uploadingFiles.length > 0")
    .tag(v-for="f in uploadingFiles", :key="f.name") {{ f.name }}

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
          span(v-if="file.is_dir")
            nuxt-link(:to="buildSubLink(file.name)") {{ file.name }}
            span /
          span(v-else) {{ file.name }}
        td {{ formatByteSize(file.size) }}
        td.is-hidden-touch {{ formatTime(file.mtime) }}

</template>

<script>
import fecha from 'fecha'
import { mapState } from 'vuex'

export default {
  layout: 'simple',
  async fetch ({ store, route }) {
    const dir = route.query.q || ''
    await store.dispatch('file/getFiles', { dir })
  },
  data: () => ({
    errorMessage: '',
    isReloading: false,
    isDeleting: false,
    selectedFiles: [],
    uploadingFiles: [],
  }),
  computed: {
    parentLink() {
      const dir = this.$route.query.q
      if (!dir) {
        return '/file'
      }
      const splitted = dir.split('/')
      splitted.pop()
      if (splitted.length === 0) {
        return '/file'
      }
      return '/file?q=' + splitted.join('/')
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
    selectUploadingFiles() {
      this.$refs.fileInput.click()
    },
    onSelectUploadingFiles(e) {
      const files = [ ...e.target.files ]
      console.log(files)
      this.uploadingFiles = [].concat(files)
    },
    async deleteFiles() {
      const dir = this.$route.query.q || ''
      this.isDeleting = true
      // await new Promise(r => setTimeout(r, 4000))
      const wg = this.selectedFiles.map(async name => await this.$store.dispatch('file/deleteFile', { dir, name }))
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
      return '/file?q=' + suffix
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
