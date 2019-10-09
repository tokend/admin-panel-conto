<template>
  <div class="user-details-general-kyc-viewer">
    <kyc-general-section
      :user="user"
      :blob-id="blobId"
    />
  </div>
</template>

<script>
import KycGeneralSection from './UserDetails.Kyc'

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
