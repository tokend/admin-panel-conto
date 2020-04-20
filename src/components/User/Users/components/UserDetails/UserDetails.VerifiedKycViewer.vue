<template>
  <div class="user-details-verified-kyc-viewer">
    <general-kyc
      :blob-id="blobId"
      :user="user"
    />
  </div>
</template>

<script>
import { UserRecord } from '@/js/records/user.record'

export default {
  props: {
    user: {
      type: UserRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
