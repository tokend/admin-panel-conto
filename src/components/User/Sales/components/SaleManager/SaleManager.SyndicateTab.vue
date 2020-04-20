<template>
  <div class="sale-manager-corporate-tab">
    <template v-if="isLoaded">
      <div class="sale-manager-corporate-tab__details-wrp">
        <label class="data-caption">
          {{ "sale-manager-syndicate-tab.label" | globalize }}
        </label>
        <ul class="key-value-list">
          <li>
            <span>{{ "sale-manager-syndicate-tab.name" | globalize }}</span>
            <span>{{ corporate.company }}</span>
          </li>
          <li v-if="kycAvatarKey">
            <span>{{ "sale-manager-syndicate-tab.avatar" | globalize }}</span>
            <span>
              <user-doc-link-getter :file-key="kycAvatarKey">
                {{ "sale-manager-syndicate-tab.open-file" | globalize }}
              </user-doc-link-getter>
            </span>
          </li>
          <li v-if="kycAvatarKey">
            <span>Banner</span>
            <span>
              <user-doc-link-getter :file-key="kycBannerKey">
                Open file
              </user-doc-link-getter>
            </span>
          </li>
          <li v-if="corporate.homepage">
            <span>
              {{ "sale-manager-syndicate-tab.home-page" | globalize }}
            </span>
            <span>{{ corporate.homepage }}</span>
          </li>
          <li v-if="corporate.industry">
            <span>
              {{ "sale-manager-syndicate-tab.industry" | globalize }}
            </span>
            <span>{{ corporate.industry }}</span>
          </li>
          <li v-if="corporate.bank_account">
            <span>Card number</span>
            <span>{{ corporate.bank_account }}</span>
          </li>
          <li v-if="corporate.invite">
            <span>Invitation code</span>
            <span>{{ corporate.invite }}</span>
          </li>
          <li v-if="kycAvatarKey">
            <div class="sale-manager-corporate-tab__doc-view-wrp">
              <h3>
                {{ "sale-manager-syndicate-tab.header-avatar" | globalize }}
              </h3>
              <user-doc-getter
                class="sale-manager-corporate-tab__doc-view"
                :file-key="kycAvatarKey"
                :mime-type="kycAvatarMimeType"
              />
            </div>
          </li>
          <li v-if="kycBannerKey">
            <div class="sale-manager-corporate-tab__doc-view-wrp">
              <h3>Banner</h3>
              <user-doc-getter
                class="sale-manager-corporate-tab__doc-view"
                :file-key="kycBannerKey"
                :mime-type="kycBannerMimeType"
              />
            </div>
          </li>
          <li v-if="corporate.description">
            <div class="sale-manager-corporate-tab__doc-view-wrp">
              <h3>Description</h3>
              <markdown-formatter :source="corporate.description" />
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template v-else-if="isFailed">
      <p class="text danger">
        {{ "sale-manager-syndicate-tab.error" | globalize }}
      </p>
    </template>

    <template v-else>
      <p class="text">
        {{ "sale-manager-syndicate-tab.loading" | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import { UserDocLinkGetter, UserDocGetter } from '@comcom/getters'
import { MarkdownFormatter } from '@comcom/formatters'

import _get from 'lodash/get'
import { ErrorHandler } from '@/utils/ErrorHandler'
import { api } from '@/api'
import _isEmpty from 'lodash/isEmpty'

export default {
  components: {
    UserDocLinkGetter,
    UserDocGetter,
    MarkdownFormatter,
  },

  props: {
    sale: { type: Object, default: _ => ({}) },
    saleRequest: { type: Object, default: _ => ({}) },
    user: { type: Object, default: _ => ({}) },
    blobId: { type: String, default: '' },
  },

  data () {
    return {
      corporate: {},
      isLoaded: false,
      isFailed: false,
    }
  },

  computed: {
    kycAvatarKey () {
      return _get(this.corporate, 'documents.kyc_avatar.key')
    },
    kycBannerKey () {
      return _get(this.corporate, 'documents.bravo.key')
    },

    kycAvatarMimeType () {
      return _get(this.corporate, 'documents.kyc_avatar.mime_type')
    },
    kycBannerMimeType () {
      return _get(this.corporate, 'documents.bravo.mime_type')
    },
  },

  created () {
    this.getCorporate({
      ownerId: _get(this.sale, 'owner.id') ||
        _get(this.saleRequest, 'requestor.id') ||
        _get(this.user, 'address'),
      blobId: this.blobId,
    })
  },

  methods: {
    async getCorporate ({ ownerId: owner, blobId }) {
      try {
        const response = blobId
          ? await api.getWithSignature(`/accounts/${owner}/blobs/${blobId}`)
          : await api.getWithSignature(`/blobs/${await this.getBlobId(owner)}`)
        this.corporate = JSON.parse(
          response.data.value || response.data[0].value
        )
        this.isLoaded = true
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    async getBlobId (owner) {
      const { data } = await api.getWithSignature('/v3/change_role_requests', {
        filter: { requestor: owner },
        page: {
          limit: 1,
          order: 'desc',
        },
        include: ['request_details'],
      })
      let blobId = ''
      if (!_isEmpty(data[0].requestDetails.creatorDetails)) {
        blobId = data[0].requestDetails.creatorDetails.blobId
      }
      return blobId
    },
  },
}
</script>

<style scoped>
  .key-value-list {
    word-break: break-word;
  }
</style>
