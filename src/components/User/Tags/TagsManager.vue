<template>
  <div class="tags-manager">
    <div class="tags-manager__form">
      <input-field
        v-model="form.tagName"
        :placeholder="'tags-manager.add-tag-input-placeholder' | globalize"
        class="tags-manager__input"
      />
      <!-- :disabled="isPending" -->
      <button
        class="app__btn tags-manager__btn"
        @click="addTag(form.tagName)"
      >
        {{ "tags-manager.btn-add-tag" | globalize }}
      </button>
    </div>
    <div class="sale-list__list-wrp">
      <template v-if="list && list.length">
        <ul class="app-list">
          <div class="app-list__header">
            <span class="app-list__cell">
              {{ "sale-list.name" | globalize }}
            </span>
          </div>
          <tags-list-row
            v-for="item in list"
            :key="item.id"
            :id="item.id"
            :name="item.name"
            @update-list="reloadCollectionLoader"
          />
        </ul>
      </template>

      <template v-else>
        <ul class="app-list">
          <li class="app-list__li-like">
            <template v-if="isLoaded">
              {{ "sale-list.nothing-here-yet" | globalize }}
            </template>
            <template v-else>
              {{ "sale-list.loading" | globalize }}
            </template>
          </li>
        </ul>
      </template>
      <div class="app__more-btn-wrp">
        <collection-loader
          :first-page-loader="getList"
          @first-page-load="setList"
          @next-page-load="extendList"
          ref="collectionLoaderBtn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CollectionLoader } from '@/components/common'
import { InputField } from '@comcom/fields'
import TagsListRow from '@/components/User/Tags/components/TagsListRow'

import { api } from '@/api'
import { ErrorHandler } from '@/utils/ErrorHandler'

export default {
  name: 'tags-manager',

  components: {
    CollectionLoader,
    InputField,
    TagsListRow,
  },

  data: _ => ({
    isLoaded: true,
    list: [],
    form: {
      tagName: '',
    },
  }),

  methods: {
    async getList () {
      this.isLoaded = false
      let response = {}

      try {
        response = await api.getWithSignature('/integrations/marketplace/tags')
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
      return response
    },

    setList (data) {
      this.list = data
    },

    extendList (data) {
      this.list = this.list.concat(data)
    },

    reloadCollectionLoader () {
      this.$refs.collectionLoaderBtn.loadFirstPage()
    },

    async addTag (tagName) {
      const query = {
        data: {
          type: 'tags',
          attributes: {
            name: tagName,
          },
        },
      }
      this.form.tagName = ''
      await api.postWithSignature('/integrations/marketplace/tags', query)
      this.reloadCollectionLoader()
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/colors";

.tags-manager__form {
  background-color: $color-content-bg;
  border-radius: 0.3rem;
  box-shadow: 0.7px 0.7px 5.6px 0.4px rgba(170, 170, 170, 0.72);
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tags-manager__btn {
  max-width: 20rem;
}

.tags-manager__input {
  max-width: 30%;
}
</style>
