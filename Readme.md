# jQuery Track Everything
jQuery Track Everything is a jQuery plugin that makes tracking events with Google Analytics extremely easy. Not only can it be used by developers, designers, and marketers on the sites they create and manage, but it can easily be written into plugins for CMSs, like [WordPress](https://github.com/ethoseo/track-everything

[![Build Status](https://travis-ci.org/nquinlan/jquery-track-everything.png?branch=master)](https://travis-ci.org/nquinlan/jquery-track-everything)

The plugin requires minimal configuration as it intelligently names and tracks events. It also allows users to easily track non-standard events, allowing the user to truly _track everything_. 

However, jQuery Track Everything does not aim to do advanced tracking (e.g. event values and advanced interactions). In more advanced settings it can be used in conjunction with custom code to create deep tracking.

jQuery Track Everything works with both [ga.js](https://developers.google.com/analytics/devguides/collection/gajs/) (the traditional `_gaq` interface) and [analytics.js](https://support.google.com/analytics/answer/2790010?hl=en) (Universal Analytics).

## Basic Usage
To use jQuery Track Everything, simply include the script, and call the jQuery method `track`. The plugin will default to tracking a number of previously untracked events that occur within the selected jQuery object.

```js
$("body").track({ /* Optional Configuration */ });
```

## Configuration
jQuery Track Everything is highly configurable, to allow for tracking and naming many irregular events. You may track the children of any jQuery object, (e.g. `body`, `#content`, `aside:first div:eq(2)`) by selecting it and calling the `track` method. To configure the plugin pass it a configuration object.

```js
// Default Configuration
$("body").track({
	options: {
		forms: true,
		outbound: true,
		email: true,
		phone: true,
		anchor: true,
		universal: false,
		debug: false
	},
	dictionary: [],
	additional: []
});
```
### Options (`options`)
The options parameter sets a number of booleans controlling jQuery Track Everything's default behavior.

|  option   | description                                       |
|-----------|---------------------------------------------------|
| forms     | track form submissions _note: this only tracks that the submission occured, not the submission's contents_ |
| outbound  | track outbound links (these are tracked as [non-interaction](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#non-interaction) events) |
| email     | track `mailto` links                              |
| phone     | track `tel` links                                 |
| anchor    | track links to anchors (`#`)                      |
| universal | track events using [Universal Analytics (analytics.js)](https://support.google.com/analytics/answer/2790010?hl=en), rather than [ga.js](https://developers.google.com/analytics/devguides/collection/gajs/) |
| debug     | help debug tracking, this will `console.log` any events that are sent to Google, additionally it adds several descriptive classes to anything tracked by Track Everything                                             |

### Renaming Default Events (`dictionary`)
Although, jQuery Track Everything attempts to intelligently name all events, you may have some more specific names for the default events the plugin tracks. To change the names, you may pass an array of definition objects to the `dictionary` field of the configuration object.

```js
$("body").track({
	dictionary: [
		{
			"selector" : "#quote-widget .contact-form",
			"name" : "Quote Request"
		},
		{
			"selector" : ".navbar .button.support-link",
			"name" : "Support Site"
		}
	]
});
```

#### Definition Object
A definition object consists of two fields that select and then name an event.

| field    | description                                        |
| -------- | -------------------------------------------------- |
| selector | a [jQuery Selector](http://api.jquery.com/category/selectors/) for the object causing the event |
| name     | the new name for the event                         |

_Note: Definitions only change the name of the event. If you need to change the category or the action, you will need to track an "additional" event._

### Tracking Additional Events (`additional`)
Beyond tracking standard events, jQuery Track Everything allows the user to track any event that jQuery can detect. To configure an additional event, you may pass an array of additional event objects to the `additional` field of the configuration object.

```js
$("body").track({
	additional: [
		{
			"selector" : "input",
			"events" : ["keypress", "select"],
			"category" : "Form",
			"action" : "Interaction"
		},
		{
			"selector" : "button.awesome",
			"events" : ["keypress", "click"],
			"category" : "Link",
			"action" : "Click",
			"name" : "Awesome!"
		}
	]
});
```

#### Additional Event Object
An additional event object consists of a number of required and optional fields that override any other event.

| field    | type   | description |
| -------- | ------ | -------- |
| selector | [jQuery Selector](http://api.jquery.com/category/selectors/) | _required_ - the object to track |
| events   | Array  | _required_ - an array of jQuery events, for which to fire on |
| category | String | _required_ - [the category](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Categories) to send to Google |
| action   | String | _required_ - [the action](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Actions) to send to Google |
| name     | String | _optional_ - [the label](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Labels) to send to Google _(if this is not supplied, the plugin will attempt to intelligently name the event)_ |

## Behavior
jQuery Track Everything tries very hard to intelligently classify and name events, however, this can lead to questions about how events are named and assigned.

The plugin allows configuration to overwrite defaults, weighting heavy configurations over lighter ones. As such configuration goes as follows (with each subsequent level overruling the previous ones):

1. Defaults
2. Definitions (`dictionary`)
3. Additional Events (`additional`)

### Default Event Naming
Default events follow different naming conventions based on several attributes, as seen below (later attributes are given higher preference)

| event     | attributes                  |
|-----------|-----------------------------|
| forms     | `id`, `title`, `name`       |
| outbound  | `href`                      |
| email     | `href` _without `mailto:`_  |
| phone     | `href` _without `tel:`_     |
| anchor    | `href` _without `#`_        |

## Alternatives
jQuery Track Everything not quite fit your needs? There are a few of alternatives, I recommend:

- **[jQuery Google Analytics](https://github.com/JimBobSquarePants/jQuery-Google-Analytics)** by [James Sout](https://github.com/JimBobSquarePants) - _Fire traditional Google Analytics Events on Click events by using several data attributes._
- **[Scout](http://www.benplum.com/projects/scout/)** by [Ben Plum](https://github.com/benplum) - _Fire traditional Google Analytics Events on Click events by using one data attribute._
- **Custom Code** - If none of these do exactly what you need, it's pretty easy to write your own event tracking with jQuery's [`.on()`](http://api.jquery.com/on/) method.

## License
jQuery Track Everything is licensed MIT. Much of the original code for jQuery Track Everything came from my work at [Ethoseo](http://ethoseo.com/) on a [WordPress Plugin](https://github.com/ethoseo/track-everything) of the same name. The original code was also MIT licensed.
