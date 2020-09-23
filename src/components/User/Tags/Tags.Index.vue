<template>
  <div class="tags">
    <h2>{{ "tags-index.header" | globalize }}</h2>

    <div class="tags__list-wrp">
      <tags-manager />
    </div>
  </div>
</template>

<script>
import TagsManager from './TagsManager'

export default {
  components: {
    TagsManager,
  },
}
</script>
