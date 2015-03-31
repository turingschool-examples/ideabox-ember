import Ember from 'ember';

export default Ember.Component.extend({

  editing: false,

  actions: {
    edit: function () {
      let editing = this.get('editing');
      if (editing) {
        this.get('idea').save().then(() => {
          this.set('editing', false);
        });
      } else {
        this.set('editing', true);
      }
    },
    delete: function () {
      this.get('idea').destroyRecord();
    }
  }

});
