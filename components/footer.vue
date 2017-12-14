<style scoped lang="scss">
@import "../css/variables";
footer {
  margin-top: auto;

  height: 24px;
  line-height: 24px;
  font-size: 14px;

  background-color: $black-ter;
  color: $white-ter;
}

.footer-content {
  padding: 0 24px;
}

.footer-right-text {
  float: right;
  font-style: italic;
}
</style>

<template lang="pug">
footer
  .container
    .footer-content
      span.footer-right-text Built at {{ builtAt }}
</template>


<script>
export default {
  data: () => ({
    builtAt: process.env.builtAt
  })
}
</script>
