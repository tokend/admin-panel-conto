<template>
  <div class="asset-pairs-show">
    <div class="asset-pairs-show__mgr-wrp">
      <asset-pair-manager :base="base" :quote="quote" />
    </div>
  </div>
</template>

<script>
import AssetPairManager from './components/AssetPairManager'

export default {
  components: { AssetPairManager },

  props: {
    base: { type: String, required: true },
    quote: { type: String, required: true },
  },
}
</script>

<style scoped>
.asset-pairs-show__mgr-wrp {
  max-width: none;
}
</style>
