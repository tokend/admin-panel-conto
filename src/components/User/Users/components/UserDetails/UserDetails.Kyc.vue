<template>
  <div class="user-details-account">
    <h3 class="user-details-account__title">
      KYC information
    </h3>
    <ul class="user-details-account__key-value-list key-value-list">
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
  </div>
</template>

<script>

export default {
  props: {
    kyc: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.user-details-account__title {
  margin-bottom: 2rem;
}
</style>
