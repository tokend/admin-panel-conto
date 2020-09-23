<template>
  <li
    class="app-list__li"
  >
    <span
      class="app-list__cell"
      :title="name"
    >
      {{ name }}
    </span>
    <div>
      <button
        :disabled="isPending"
        class="app__btn tags-list-row__btn"
        @click="deleteTag(id)"
      >
        {{ "tags-list-row.btn-delete" | globalize }}
      </button>
    </div>
  </li>
</template>

<script>
import { api } from '@/api'
import { ErrorHandler } from '@/utils/ErrorHandler'

const EVENTS = {
  updateList: 'update-list',
}
export default {
  name: 'tags-list-row',

  props: {
    id: { type: [Number, String], required: true },
    name: { type: String, required: true },
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
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>

.tags-list-row__btn {
  max-width: 20rem;
}
</style>
