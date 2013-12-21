$(function () {

	var defaultSetup = {
		setup: function () {
			_gaq = [];
		},
		teardown: function () {
			deepEqual(_gaq, [], "no addditional events");
			_gaq = undefined;
		}
	};

	module("tracking", defaultSetup);

	var getCreatedEvent = function (length, start) {
		length = typeof length !== 'undefined' ? length : 3;
		start = typeof start !== 'undefined' ? start : 0;

		var createdEvent = _gaq.pop();
		
		if(createdEvent) {
			createdEvent = createdEvent.slice(start, length);
		}

		return createdEvent;
	};

	test("should track built in events", function () {
			$('\
				<div id="builtin">\
					<form id="form">\
						<input type="text" name="test" value="test">\
						<input type="submit">\
					</form>\
					<a id="outbound" href="http://example.com">Test</a>\
					<a id="email" href="mailto:you@example.com">Test</a>\
					<a id="phone" href="tel:1-555-555-5555">Test</a>\
					<a id="anchor" href="#place">Test</a>\
				</div>\
			').appendTo("#qunit-fixture");

			$("#qunit-fixture #builtin").track({
				additional: [],
				dictionary: [],
				options: {
					forms: true,
					outbound: true,
					email: true,
					phone: true,
					anchor: true,
					universal: false,
					debug: false
				}
			});

			var linkTest = function (type) {
				var typeIdentifier = type.toLowerCase();
				$("#qunit-fixture #" + typeIdentifier).on("click", function(e){
					e.preventDefault();
				}).trigger("click");

				var createdEvent = getCreatedEvent();

				deepEqual(createdEvent, ['_trackEvent', 'Link', type], typeIdentifier + " link tracked");
			};

			
			$("#qunit-fixture #form").on("submit", function(e){
				e.preventDefault();
			}).trigger("submit");

			var createdEvent = getCreatedEvent();
		deepEqual(createdEvent, ['_trackEvent', 'Form', 'Submission'], "form submission tracked");

		linkTest("Outbound");
		linkTest("Email");
		linkTest("Phone");
		linkTest("Anchor");

	});

	test("should track custom events", function () {

		$('\
			<div id="custom">\
				<div id="div">Test</div>\
				<span id="span">Test</span>\
				<input id="input" type="text"/>\
			</div>\
		').appendTo("#qunit-fixture");

		var additional = [
			{
				"selector" : "#div",
				"events" : ["hover", "click"],
				"name" : "div"
			},
			{
				"selector" : "#span",
				"events" : ["keypress", "hover", "dblclick"],
				"name" : "span"
			},
			{
				"selector" : "#input",
				"events" : ["click", "focus", "keypress", "blur"],
				"name" : "input"
			}
		];

		additional = additional.map(function (additionalElement) {
			// Create some differentiation + randomness between events (just in case something weird is going on)
			additionalElement.category = additionalElement.name + " Category " + Math.random();
			additionalElement.action = additionalElement.name + " Action " + Math.random();
			return additionalElement;
		});

		$("#qunit-fixture #custom").track({
			additional: additional,
			dictionary: [],
			options: {
				forms: false,
				outbound: false,
				email: false,
				phone: false,
				anchor: false,
				universal: false,
				debug: false
			}
		});

		$.each(additional, function (index, additionalElement) {
			$.each(additionalElement.events, function (index, additionalEvent){
				$("#qunit-fixture #custom").find(additionalElement.selector).trigger(additionalEvent);
				var createdEvent = getCreatedEvent(4);
				deepEqual(createdEvent, ['_trackEvent', additionalElement.category, additionalElement.action, additionalElement.name], additionalElement.name + " " + additionalEvent + " tracked");
			});
		});

	});

	module("naming", defaultSetup);

	test("should allow for custom names on default events", function () {

		$('\
			<div id="default-names">\
				<a id="yay" href="http://example.com">Test</a>\
				<a id="nay" href="mailto:you@example.com">Test</a>\
			</div>\
		').appendTo("#qunit-fixture");

		var dictionary = [
			{
				"selector": "#yay",
				"name" : "Awesome"
			},
			{
				"selector": "#nay",
				"name" : "Stupid"
			}
		];

		$("#qunit-fixture #default-names").track({
			additional: [],
			dictionary: dictionary,
			options: {
				forms: false,
				outbound: true,
				email: true,
				phone: false,
				anchor: false,
				universal: false,
				debug: false
			}
		});

		var nameTest = function (selector, name) {
			var $namedElement = $("#qunit-fixture").find(selector);

			equal($namedElement.attr("data-track-everything-name"), name, "element named correctly (" + selector + ")");

			$namedElement.on("click", function(e){
				e.preventDefault();
			}).trigger("click");

			var createdEvent = getCreatedEvent(4);
			createdEvent[2] = null;

			deepEqual(createdEvent, ['_trackEvent', 'Link', null, name], "named event tracked (" + selector + ")");
		};

		$.each(dictionary, function (index, definition) {
			nameTest(definition.selector, definition.name);
		});

	});


	module("universal", {
		setup: function () {
			universal = [];
			ga = function (name, info) {
				// equal(name, 'send', "called send method");
				universal.push(info);
			};
		},
		teardown: function () {
			deepEqual(universal, [], "no addditional events");
			universal = undefined;
			ga = undefined;
		}
	});

	test("should track events through universal analytics", function () {

		$('\
			<div id="universal">\
				<a id="alternate" href="mailto:you@example.com">Test</a>\
			</div>\
		').appendTo("#qunit-fixture");

		$("#qunit-fixture #universal").track({
			additional: [],
			dictionary: [
				{
					"selector" : "#alternate",
					"name" : "Alternate"
				}
			],
			options: {
				forms: false,
				outbound: false,
				email: true,
				phone: false,
				anchor: false,
				universal: true,
				debug: false
			}
		});

		$("#alternate").on("click", function (e) {
			e.preventDefault();

			var createdEvent = universal.pop();

			var expectedEvent = {
				'hitType': 'event',
				'eventCategory': 'Link',
				'eventAction': 'Email',
				'eventLabel': 'Alternate'
			};

			deepEqual(createdEvent, expectedEvent, "event tracked through universal analytics");
		}).trigger("click");

	});

});