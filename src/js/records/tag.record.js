import _get from 'lodash/get'

export class TagRecord {
  constructor (record = {}) {
    this._record = record

    this.id = _get(record, 'id')
    this.name = _get(record, 'name')
  }
}
