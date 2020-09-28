<template>
  <li
    class="app-list__li tags-list-row"
  >
    <p
      class="app-list__cell tags-list-row__name"
      :title="tag.name"
    >
      {{ tag.name }}
    </p>
    <div class="tags-list-row__btn-wrp">
      <button
        :disabled="isPending"
        class="app__btn tags-list-row__btn"
        @click="deleteTag(tag.id)"
      >
        {{ "tags-list-row.btn-delete" | globalize }}
      </button>
    </div>
  </li>
</template>

<script>
import { api } from '@/api'
import { ErrorHandler } from '@/utils/ErrorHandler'
import { TagRecord } from '@/js/records/tag.record'

const EVENTS = {
  updateList: 'update-list',
}
export default {
  name: 'tags-list-row',

  props: {
    tag: { type: TagRecord, required: true },
  },

  data: _ => ({
    isPending: false,
  }),

  methods: {
    async deleteTag (tagId) {
      this.isPending = true
      try {
        await api.deleteWithSignature(`/integrations/marketplace/tags/${tagId}`)
        this.$emit(EVENTS.updateList)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>

.tags-list-row__btn-wrp {
  margin: auto;
  width: 21.5rem;
  padding-right: 1.5rem;
}

.tags-list-row__btn {
  max-width: 20rem;
}
</style>
