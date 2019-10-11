<template>
  <div class="user-details-verified-kyc-viewer">
    <general-kyc
      :blob-id="blobId"
      :user="user"
    />
  </div>
</template>

<script>
import GeneralKyc from './UserDetails.GeneralKyc'

export default {
  components: {
    GeneralKyc,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    blobId: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
