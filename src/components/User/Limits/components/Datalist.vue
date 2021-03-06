<template>
  <div class="datalist">
    <input-field
      v-model="docItem.label"
      class="datalist__input-field"
      :label="'data-list.lbl-document-type' | globalize"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
    />
    <!-- <input type="text"
            v-model="docItem.label"
            class="datalist__input-field"
            @keyup.down="onArrowDown"
            @keyup.up="onArrowUp"
    > -->
    <ul
      class="datalist__list"
      v-if="isShowingList"
      ref="list">
      <template v-for="(item, i) in filteredList">
        <li
          class="datalist__list-item"
          :key="i"
          ref="option"
          @click="selectItemFromList(item)"
          :class="{ 'datalist__list-item__is-active': i === pointerCounter }">
          {{ item }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { InputField } from '@comcom/fields'
import DatalistMixin from '@/mixins/datalist.mixin'
import { DOCUMENT_TYPES_STR } from '@/constants'

export default {
  name: 'datalist-field',
  components: { InputField },
  mixins: [DatalistMixin],
  props: {
    docItem: { type: Object, required: true },
  },

  data: _ => ({
    searchValue: '',
    isShowingList: false,
    pointerCounter: 0,
    DOCUMENT_TYPES_STR,
  }),

  computed: {
    filteredList () {
      return this.getNormalizedDocsList().filter(item => {
        return item.toLowerCase()
          .includes(this.docItem.label.toLowerCase())
      })
    },
  },

  watch: {
    docItem: {
      handler: function (value) {
        if (this.searchValue === value.label) return
        this.showDatalist()
      },
      deep: true,
    },
  },

  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },

  destroyed () {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    selectItemFromList (item) {
      this.isShowingList = false
      this.searchValue = item
      this.docItem.label = item
    },

    showDatalist () {
      this.isShowingList = true
    },

    onArrowDown () {
      if (this.pointerCounter < this.filteredList.length - 1) {
        this.pointerCounter++
        this.fixScrolling()
      }
    },

    onArrowUp () {
      if (this.pointerCounter > 0) {
        this.pointerCounter--
        this.fixScrolling()
      }
    },

    handleClickOutside (event) {
      if (!this.$el.contains(event.target)) {
        this.pointerCounter = -1
        this.isShowingList = false
      }
    },

    fixScrolling () {
      const currentHeight = this.$refs.option[this.pointerCounter].clientHeight
      this.$refs.list.scrollTop = currentHeight * this.pointerCounter
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/colors";
.datalist {
  width: 100%;
  max-width: 28rem;
  position: relative;
}

.datalist__list {
  position: absolute;
  background: $color-content-bg;
  width: 100%;
  max-height: 10rem;
  overflow-y: scroll;
  border: 1px solid $color-sub-nav-bg;
  border-top: none;
}

.datalist__list-item {
  &:hover {
    background: $color-sub-nav-hover;
  }
}
.datalist__list-item__is-active {
  background: $color-sub-nav-hover;
}
</style>
