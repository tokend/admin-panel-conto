<template>
  <div>
    <user-header>
      <router-link :to="{ name: 'tags.manager' }" slot="nav">
        {{ "tags.link-tags" | globalize }}
      </router-link>
    </user-header>
    <router-view />
  </div>
</template>

<script>
import UserHeader from '@/components/User/components/UserHeader'

export default {
  name: 'tags',
  components: {
    UserHeader,
  },
}
</script>
