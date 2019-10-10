<template>
  <div class="general-kyc">
    <h3 class="general-kyc__title">
      General user details
    </h3>
    <template v-if="isLoaded">
      <ul class="general-kyc__key-value-list key-value-list">
        <li>
          <span>First name</span>
          <span :title="kyc.firstName">
            {{ kyc.firstName }}
          </span>
        </li>
        <li>
          <span>Last name</span>
          <span :title="kyc.lastName">
            {{ kyc.lastName }}
          </span>
        </li>
      </ul>
    </template>

    <template v-else>
      <p class="text">
        Loading...
      </p>
    </template>
  </div>
</template>

<script>
import { ErrorHandler } from '@/utils/ErrorHandler'
import { api } from '@/api'
import deepCamelCase from 'camelcase-keys-deep'

export default {
  props: {
    blobId: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      kyc: {},
      isLoaded: false,
    }
  },

  created () {
    this.getKyc()
  },

  methods: {
    async getKyc () {
      try {
        const { data } = await api.getWithSignature(`/accounts/${this.user.address}/blobs/${this.blobId}`)
        this.kyc = deepCamelCase(JSON.parse(data.value))
        this.isLoaded = true
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.general-kyc__title {
  margin-bottom: 2rem;
}
</style>
