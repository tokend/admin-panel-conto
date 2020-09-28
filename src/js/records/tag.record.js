import _get from 'lodash/get'

export class Tag {
  constructor (record = {}) {
    this.id = _get(record, 'id')
    this.name = _get(record, 'name')
  }
}
