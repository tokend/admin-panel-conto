<template>
  <div class="user-details-verified-kyc-viewer">
    <kyc-general-section
      :blob-id="blobId"
      :user="user"
    />
  </div>
</template>

<script>
import KycGeneralSection from './UserDetails.GeneralKyc'

export default {
  components: {
    KycGeneralSection,
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
