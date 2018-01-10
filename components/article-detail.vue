<style scoped lang="scss">
@import "../css/variables";

.article-heading {
  margin: 32px 0;
}

.article-title {
  font-size: 36px;
  line-height: 48px;
  margin: 8px 0;
  text-align: center;
}

.article-digest {
  font-size: 16px;
  line-height: 24px;
  margin: 8px 0;
  text-align: center;
}

.article-subs {
  margin: 16px auto;
  text-align: center;
}

.article-sub {
  display: inline-block;
  margin: 0 4px;
  .tag {
    line-height: 22px;
  }
}

.article-delimiter {
  margin: 16px auto;
  width: 128px;
  height: 2px;
  background-color: $black-ter;
}
</style>

<template lang="pug">
div
  .article-heading
    h1.article-title {{ article.title }}
    h2.article-digest(v-if="article.digest") {{ article.digest }}
    .article-subs
      .article-sub {{ article.date | date }}
      .article-sub(v-if="article.tags.length > 0") ・
      .article-sub(v-for="tag in article.tags")
        nuxt-link.tag.is-white(:to="'/archive?tag=' + tag") {{ tag }}
      .article-sub(v-if="authorized")
        nuxt-link(:to="'/-/' + article.slug + '/edit'") edit
    .article-delimiter
  div
    my-markdown {{ article.content }}
</template>

<script>
export default {
  props: ['article'],
  methods: {
    click() {
      console.log(this)
    }
  }
}
</script>
