# IdeaBox Ember

## Basic Installation

Clone down this repository and run the following:

```
npm install && bower install
```

## Setting Up Our Fixtures

Let's start by generating a model:

```
ember g model idea
```

This will generate the following files:

```
installing
  create app/models/idea.js
installing
  create tests/unit/models/idea-test.js
```

We're going to focus our attention on `app/models/idea.js`. There is some boiler plate, but we're going to move some stuff around:

```js
import DS from 'ember-data';

let Idea = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
});

Idea.reopenClass({
  FIXTURES: [
    { id: 1, title: "First Idea", body: "Lorem ipsum…" },
    { id: 2, title: "Second Idea", body: "Lorem ipsum…" }
  ]
});

export default Idea;
```

We'll also need an adapter to our back end. One minor issue is that we don't have a back end. So, let's just use Ember Data's fixture adapter. First, we'll generate the adapter:

```
ember g adapter application
```

Next we'll switch out the `DS.RestAdapter` for `DS.FixtureAdapter`:

```js
import DS from 'ember-data';

export default DS.FixtureAdapter.extend({
});
```

## Setting Up Our Route

So, let's start by generating a route:

```
ember g route ideas
```

We don't need to do this per say, but we're only going to have one route in this application it. So, let's map it to the root. In `app/router.js`:

```js
export default Router.map(function() {
  this.route('ideas', { path: '/' });
});
```

Now, we'll fetch our great ideas when the application fires up. In `app/routes/ideas.js`:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.find('idea');
  }
});
```

There is still not a lot else to see in our application, but we can check it out the ember inspector to see that our notes have been loaded up.