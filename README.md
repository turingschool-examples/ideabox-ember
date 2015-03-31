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

## Building Templates

So, we've got our data loaded up, but we aren't doing anything with it yet.

Let's take a peek in the `app/templates` folder.

In `app/templates/application.hbs`:

```hbs
<div class="container">

  <heading>
    <h1>IdeaBox</h1>
  </heading>

  {{outlet}}

</div>
```

And then we'll put the meat of our application in the `app/templates/ideas.hbs`. Here is some markup I stole:

```hbs
<section id="new-idea">
  <h2>Add a New Idea</h2>
  <form class="new-idea-form">
    <label>Title</label>
    <input type="text" placeholder="Title" class="new-idea-title">
    <label>Body</label>
    <input type="text" placeholder="Body" class="new-idea-body">
    <input type="submit" value="Submit Your Great Idea">
  </form>
</section>

<section id="ideas">
  <!-- We'll put some more stuff here in a moment! -->
</section>
```

Okay, let's dig into that `section#ideas` tag:

```hbs
<section id="ideas">
  {{#each model as |idea|}}
  <div class="idea">
    <h2>{{idea.title}}</h2>
    <p>{{idea.body}}</p>
  </div>
  {{/each}}
</section>
```

Yay, we're now rendering some ideas!

But, our form doesn't work. Bummer.

## Setting Up Actions in a Controller

We want to wire up some actions. That's the job of the controller.

```
ember g controller ideas
```

Let's set it up with the following:

```
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
```

So, we have an action that will create a new note, let's wire up our template. In `app/templates/ideas.hbs`:

```hbs
<section id="new-idea">
  <h2>Add a New Idea</h2>
  <form class="new-idea-form">
    <label>Title</label>
    {{input type="text" placeholder="Title" class="new-idea-title" value=title}}
    <label>Body</label>
    {{input type="text" placeholder="Body" class="new-idea-body" value=body}}
    <input type="submit" value="Submit Your Great Idea" {{action 'addNewIdea'}}>
  </form>
</section>
```

Go ahead and try to create a new note. It should work.

## Isolating Functionality with Components

So, what about editing and deleting ideas? When we used jQuery, we solved this problem by doing a bunch of DOM traversal and manipulation. IdeaBox is still pretty simple, but in a complex application, this technique can get out of hand relatively quickly.

If only we could take each idea and isolate it in it's own little world. Oh wait, we can with Ember components.

```
ember g component awesome-idea
```

So, this generated two files:

```
installing
  create app/components/awesome-idea.js
  create app/templates/components/awesome-idea.hbs
```

The JavaScript file will hold the behavior of our component and the Handlebars file will hold the markup.

The first step is to move markup for an individual idea into our new component.

In `app/templates/components/awesome-idea.hbs`:

```hbs
<div class="idea">
  <h2>{{idea.title}}</h2>
  <p>{{idea.body}}</p>
</div>
```

Then in `app/templates/ideas.hbs`:

```hbs
<section id="ideas">
  {{#each model as |idea|}}
    {{awesome-idea idea=idea}}
  {{/each}}
</section>
```

The end result should look exactly like it did before we went down this road.

### Deleting Notes

Let's add a button to delete an idea in `app/templates/components/awesome-idea.hbs`:

```
<div class="idea">
  <h2>{{idea.title}}</h2>
  <p>{{idea.body}}</p>
  <div class="buttons">
    <button class="delete" {{action 'delete'}}>Delete</button>
  </div>
</div>
```

Alright, cool—we have a button with an action. Now, we just need to write the implementation:

```js
import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    delete: function () {
      this.get('idea').destroyRecord();
    }
  }

});
```

Let's go back to our browser, we should be able to delete a note.

### Updating Notes

So, we can delete notes—but what about updating them? That's doable too.

First, let's update our component with a form updating the note.

```hbs
<div class="idea">
  <h2>{{idea.title}}</h2>
  <p>{{idea.body}}</p>
  <div class="buttons">
    <button class="edit" {{action 'edit'}}>Edit</button>
    <button class="delete" {{action 'delete'}}>Delete</button>
    {{#if editing}}
    <form class="edit-idea-form">
      <label>Title</label>
      {{input type="text" placeholder="Title" class="idea-title" value=idea.title}}
      <label>Body</label>
      {{input type="text" placeholder="Body" class="idea-body" value=idea.body}}
    </form>
    {{/if}}
  </div>
</div>
```

Let's also update our implementation:

```js
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
```

The super cool thing is that our view is automatically updating—but how do we know if we saved?

A model is considered 'dirty' if it's not saved to the server. Let's take this to our advantage.

```hbs
<div class="idea">
  <h2>{{idea.title}}{{if idea.isDirty '*'}}</h2>
  <!-- Look up! -->
</div>
```
