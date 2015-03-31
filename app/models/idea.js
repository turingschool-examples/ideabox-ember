import DS from 'ember-data';

let Idea = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
});

Idea.reopenClass({
  FIXTURES: [
    { title: "First Idea", body: "Lorem ipsum…" },
    { title: "Second Idea", body: "Lorem ipsum…" }
  ]
});

export default Idea;