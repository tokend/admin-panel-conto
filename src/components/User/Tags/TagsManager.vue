<template>
  <div class="tags-manager app__user-container">
    <h2>{{ "tags-manager.header" | globalize }}</h2>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p class="app__block danger tags-manager__error-message">
          {{ 'tags-manager.loading-error-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <div class="tags-manager__form">
          <input-field
            v-model="form.tagName"
            :placeholder="'tags-manager.add-tag-input-placeholder' | globalize"
            :disabled="formMixin.isDisabled"
            class="tags-manager__input"
            @blur="touchField('form.tagName')"
            :error-message="getFieldErrorMessage('form.tagName', {
              maxLength: TAG_NAME_MAX_LENGTH
            })"
          />
          <button
            class="app__btn tags-manager__btn"
            :disabled="formMixin.isDisabled"
            @click="addTag()"
          >
            {{ "tags-manager.btn-add-tag" | globalize }}
          </button>
        </div>
        <div class="tags-manager__list-wrp">
          <template v-if="list.length">
            <ul class="app-list">
              <div class="app-list__header">
                <span class="app-list__cell">
                  {{ "tags-manager.name" | globalize }}
                </span>
              </div>
              <tags-list-row
                v-for="item in list"
                :key="item.id"
                :tag="item"
                @update-list="reloadCollectionLoader"
              />
            </ul>
          </template>

          <template v-else>
            <ul class="app-list">
              <li class="app-list__li-like">
                <template>
                  {{ "tags-manager.nothing-here-yet" | globalize }}
                </template>
              </li>
            </ul>
          </template>
        </div>
      </template>
    </template>
    <template v-else>
      <p class="app__block tags-manager__loader">
        {{ "tags-manager.loading" | globalize }}
      </p>
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
</template>

<script>
import { CollectionLoader } from '@/components/common'
import { InputField } from '@comcom/fields'
import TagsListRow from '@/components/User/Tags/components/TagsListRow'

import FormMixin from '@/mixins/form.mixin'

import { TagRecord } from '@/js/records/tag.record'
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
    isLoaded: false,
    isLoadFailed: false,
    list: [],
    form: {
      tagName: '',
    },
    TAG_NAME_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        tagName: {
          required,
          maxLength: maxLength(TAG_NAME_MAX_LENGTH),
        },
      },
    }
  },

  methods: {
    async getList () {
      let response = {}

      try {
        response = await api.getWithSignature('/integrations/marketplace/tags')
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
      return response
    },

    setList (data) {
      this.list = data.map(i => new TagRecord(i))
    },

    extendList (data) {
      this.list = this.list.concat(data.map(i => new TagRecord(i)))
    },

    reloadCollectionLoader () {
      this.$refs.collectionLoaderBtn.loadFirstPage()
    },

    async addTag () {
      this.disableForm()

      try {
        await api.postWithSignature('/integrations/marketplace/tags', {
          data: {
            type: 'tags',
            attributes: {
              name: this.form.tagName,
            },
          },
        })
        this.reloadCollectionLoader()
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.clearFields()
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/colors";

.tags-manager__form {
  background-color: $color-content-bg;
  border-radius: 0.3rem;
  box-shadow: 0.07rem 0.07rem 0.56rem 0.04rem rgba(170, 170, 170, 0.72);
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

.tags-manager__error-message {
  text-align: center;
}

.tags-manager__loader {
  text-align: center;
}
</style>
