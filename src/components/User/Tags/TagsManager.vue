<template>
  <div class="tags-manager">
    <div class="tags-manager__form">
      <input-field
        v-model="tagName"
        :placeholder="'tags-manager.add-tag-input-placeholder' | globalize"
        :disabled="isPending"
        class="tags-manager__input"
        @blur="touchField('tagName')"
        :error-message="getFieldErrorMessage('tagName', {
          maxLength: TAG_NAME_MAX_LENGTH
        })"
      />
      <button
        class="app__btn tags-manager__btn"
        @click="addTag(tagName)"
      >
        {{ "tags-manager.btn-add-tag" | globalize }}
      </button>
    </div>
    <div class="tags-manager__list-wrp">
      <template v-if="list && list.length">
        <ul class="app-list">
          <div class="app-list__header">
            <span class="app-list__cell">
              {{ "tags-manager.name" | globalize }}
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
              {{ "tags-manager.nothing-here-yet" | globalize }}
            </template>
            <template v-else>
              {{ "tags-manager.loading" | globalize }}
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

import FormMixin from '@/mixins/form.mixin'

import { api } from '@/api'
import { ErrorHandler } from '@/utils/ErrorHandler'
import { required, maxLength } from '@/validators'

const TAG_NAME_MAX_LENGTH = 64

export default {
  name: 'tags-manager',

  components: {
    CollectionLoader,
    InputField,
    TagsListRow,
  },

  mixins: [ FormMixin ],

  data: _ => ({
    isLoaded: true,
    isPending: false,
    list: [],
    tagName: '',
    TAG_NAME_MAX_LENGTH,
  }),

  validations () {
    return {
      tagName: {
        required,
        maxLength: maxLength(TAG_NAME_MAX_LENGTH),
      },
    }
  },

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
      this.isPending = true
      try {
        const query = {
          data: {
            type: 'tags',
            attributes: {
              name: tagName,
            },
          },
        }
        this.tagName = ''

        await api.postWithSignature('/integrations/marketplace/tags', query)
        this.reloadCollectionLoader()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      this.isPending = false
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
