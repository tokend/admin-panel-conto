<template>
  <div class="limit-uploaded-docs">
    <template v-if="list">
      <ul class="limit-uploaded-docs__list app-list">
        <li class="app-list__header">
          <span class="limit-uploaded-docs__list-cell app-list__cell">
            {{ "limits-uploaded-docs-list.description" | globalize }}
          </span>
          <!-- eslint-disable-next-line max-len -->
          <span class="limit-uploaded-docs__list-cell app-list__cell app-list__cell--center">
            {{ "limits-uploaded-docs-list.file-extension" | globalize }}
          </span>
          <!-- eslint-disable-next-line max-len -->
          <span class="limit-uploaded-docs__list-cell app-list__cell app-list__cell--center">
            {{ "limits-uploaded-docs-list.uploading-date" | globalize }}
          </span>
          <!-- eslint-disable-next-line max-len -->
          <span class="limit-uploaded-docs__list-cell app-list__cell app-list__cell--center">
            <!-- view file btn -->
          </span>
        </li>
        <li
          class="app-list__li limit-uploaded-docs__list-row"
          v-for="(item, i) in list"
          :key="i">
          <span class="app-list__cell" :title="item.description">
            {{ item.description }}
          </span>
          <span class="app-list__cell app-list__cell--center">
            {{ getFileExtension(item.file.name) }}
          </span>
          <span class="app-list__cell app-list__cell--center">
            {{ uploadDate | formatDate }}
          </span>
          <span class="app-list__cell app-list__cell--center">
            <doc-link-getter
              :file-key="item.file.key"
              :file-type="DOCUMENTS_POLICIES.private"
            >
              {{ "limits-uploaded-docs-list.open" | globalize }}
            </doc-link-getter>
          </span>
        </li>
      </ul>
    </template>

    <template v-else>
      <ul class="app-list">
        <li class="app-list__li-like">
          <template v-if="isLoading">
            {{ "limits-uploaded-docs-list.nothing-here-yet" | globalize }}
          </template>
          <template v-else>
            {{ "limits-uploaded-docs-list.loading" | globalize }}
          </template>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>

import { DocLinkGetter } from '@comcom/getters'
import { DOCUMENTS_POLICIES } from '@/constants'

export default {
  components: { DocLinkGetter },
  props: {
    list: { type: Object, required: true },
    uploadDate: { type: String, required: true },
  },

  data () {
    return {
      isLoading: false,
      isNoMoreEntries: false,
      DOCUMENTS_POLICIES,
    }
  },

  methods: {
    getFileExtension (file) {
      return file.split(/\.(?=[^.]+$)/)[1]
    },
  },
}
</script>

<style lang="scss" scoped>
.request-list__filters-wrp {
  margin-bottom: 4rem;
}

.limit-uploaded-docs__list-row { box-shadow: none; }

.app-list__cell--center { text-align: center; }
</style>
