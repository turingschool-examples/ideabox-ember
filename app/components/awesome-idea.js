import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    delete: function () {
      this.get('idea').destroyRecord();
    }
  }

});
