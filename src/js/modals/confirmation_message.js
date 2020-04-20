import Vue from 'vue'
import store from '../../store'
import FormBlockingModalMixin from './flow-blocking-modal.mixin'
import Modal from '../../components/common/modals/Modal'
import { globalize } from '@/components/App/filters/filters'
const template = `
  <modal maxWidth="40rem">
    <p class="modal__title">{{ title }}</p>
    <div class="issuance-rl__reject-form-actions app__form-actions">
      <button class="app__btn app__btn--color-theme" @click="confirm">
        {{ confirmText }}
      </button>
      <button class="app__btn-secondary" @click="cancel">
        {{ cancelText }}
      </button>
    </div>
  </modal>
`

/**
 * @param {object} [opts]
 * @param opts.title
 * @param opts.message
 * @param opts.confirmText
 * @param opts.cancelText
 * @return {Promise<boolean>}
 */
export function confirmAction (opts = {}) {
  const title = opts.title || globalize('confirmation-message.confirm-msg')
  const confirmText = opts.confirmText || globalize('confirmation-message.submit')
  const cancelText = opts.cancelText || globalize('confirmation-message.cancel')
  const container = document.createElement('div')
  document.querySelector('#app').appendChild(container)

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const confirmMessage = new Vue({
      components: { Modal },
      mixins: [FormBlockingModalMixin],

      data () {
        return {
          title,
          confirmText,
          cancelText,
        }
      },

      watch: {
        isOpened (val) {
          if (!val) {
            if (!this.isResolved) {
              this.resolvers.resolve(false)
            }
            this.removeElement()
          }
        },
      },

      created () {
        this.setResolvers(resolve, reject)
      },

      methods: {
        confirm () {
          this.resetResolvers()
          this.removeElement()
          return this.resolvers.resolve(true)
        },

        cancel () {
          this.resetResolvers()
          this.removeElement()
          return this.resolvers.resolve(false)
        },
      },

      template,
      store,
    })

    confirmMessage.$mount(container)
  })
}
