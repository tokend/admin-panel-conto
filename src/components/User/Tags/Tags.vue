<template>
  <div class="users">
    <user-header>
      <router-link :to="{ name: 'tags' }" slot="nav">
        {{ "tags.link-tags" | globalize }}
      </router-link>
    </user-header>
    <div class="app__user-container">
      <h2>{{ "tags-index.header" | globalize }}</h2>
      <tags-manager />
    </div>
  </div>
</template>

<script>
import UserHeader from '@/components/User/components/UserHeader'
import TagsManager from './TagsManager'

export default {
  name: 'tags',
  components: {
    UserHeader,
    TagsManager,
  },
}
</script>
