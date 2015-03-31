import Ember from 'ember';

export default Ember.Controller.extend({

  title: null,
  body: null,

  actions: {

    addNewIdea: function () {
      let idea = this.getProperties('title', 'body');
      this.store.createRecord('idea', idea).save();
    }

  }

});
