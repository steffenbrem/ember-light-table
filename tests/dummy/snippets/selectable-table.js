import Ember from 'ember';
import Table from 'ember-light-table';

export default Ember.Component.extend({
  page: 1,
  limit: 20,
  dir: 'asc',
  sort: null,
  table: null,
  isLoading: false,

  columns: [{
    label: 'Avatar',
    valuePath: 'avatar',
    width: '60px',
    sortable: false,
    cellComponent: 'user-avatar'
  }, {
    label: 'First Name',
    valuePath: 'firstName',
    width: '150px'
  }, {
    label: 'Last Name',
    valuePath: 'lastName',
    width: '150px'
  }, {
    label: 'Address',
    valuePath: 'address'
  }, {
    label: 'State',
    valuePath: 'state'
  }, {
    label: 'Country',
    valuePath: 'country'
  }],

  init() {
    this._super(...arguments);
    this.set('table', new Table(this.columns));
  },

  fetchRecords() {
    this.set('isLoading', true);
    this.get('store').query('user', this.getProperties(['page', 'limit', 'sort', 'dir'])).then(records => {
      this.table.addRows(records);
      this.set('isLoading', false);
    });
  },

  actions: {
    onScrolledToBottom() {
      this.incrementProperty('page');
      this.fetchRecords();
    },

    onColumnClick(column) {
      if (column.sorted) {
        this.setProperties({
          dir: column.ascending ? 'asc' : 'desc',
          sort: column.get('valuePath'),
          page: 1
        });
        this.table.setRows([]);
        this.fetchRecords();
      }
    },

    selectAll() {
      this.table.rows.setEach('selected', true);
    },

    deselectAll() {
      this.table.get('selectedRows').setEach('selected', false);
    },

    deleteAll() {
      this.table.removeRows(this.table.get('selectedRows'));
    }
  }
});
