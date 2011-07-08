#### Copyright 2011 by Steven Littiebrant under a slightly modified MIT license, which is more amenable to minification.  See LICENSE / PubSub.js for details.

### Reasons to use over [HigginsForPresident's pubsub.js](https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js):
* Regularly performs 20%-100% faster on all browsers!
* Hierarchical events, instead of single-depth!
* *Correct* unsubscribing code!  HFP's does not unsubscribe an event if it is subscribed twice in a row.
* No jQuery dependency!

### Reasons to use over jQuery's .bind and .trigger:
* Regularly performs 30x-100x faster (or more)!
* Hierarchical events, instead of "namespaces" (which mimic CSS classes, so really aren't namespaces at all)!
* No jQuery dependency!

### Downsides compared HFP's:
* None!
* Literally.
* Well, one.  It auto-attaches to jQuery and then disappears.  But you can do that with mine, too. PubSub(jQuery); delete PubSub;

### Downsides compared to jQuery:
* No DOM-based bubbling, so it can't replace .click or any events which rely on the DOM tree.

### Other reasons it rocks:
* Nearly-agnostic parameters: `.publish("e", 1, 2, 3)` is the same as `.publish("e", [1, 2, 3])`.  Note that this means `.publish("e", [1, 2, 3])` gets expanded to call `subscribed_function(1, 2, 3)` and not `subscribed_function([1, 2, 3])`.  Pass `.publish("e", [[1, 2, 3]])` if that's desired.
* * Don't like this?  Breaks your code? Let me know, I may change it to only handle params-in-array.
* Event-bubbling halting: similar to jQuery, return `false` to prevent an event from bubbling.  All events at that level will still be called.
* Global subscriber storage: `.subscribe("", function(){})` will be called on _every_ .publish (unless prevented, see above)
* *Lightning* fast.  Fast enough to base an entire project around it.  You almost can't get faster than this.
* No dependencies of any kind, works in all browsers (tested so far.  Help me test!)!
* Clutters your namespace as minimally as possible.  Only `publish`, `subscribe`, and `unsubscribe` are added.
* Dogfooded!  I'm using this *heavily* in one of my current projects, and plan to on others in the future.

Why am I picking on HFP's implementation?  It's the one I found when I was looking for eventing systems.  No other reason!  They even admit it was "Rewritten blindly." so this is meant in no way to be a dig at their skills.

### Example use ([colored](https://github.com/Groxx/PubSub/blob/master/exampleuse.js)):
    // --------
    // Get it ready
    // --------

    // Bind to an object
    var o = {};
    PubSub(o);

    // Or construct a new one
    var c = new PubSub();

    // Or even to jQuery!
    PubSub(jQuery);

    // Want the published path passed to each handler?
    PubSub(o, true);

    // Want to specify a different internally-unique handler (in case you want to use an event named "_sub")?
    PubSub(o, true, "unique_string_here_52434675");

    // Mix and match parameters!
    PubSub(true, "uniq");
    PubSub(o, "uniq");

    // ------
    // Use it
    // ------

    // Handle an event
    x.subscribe("e", function(){
        console.log("e!");
    });
    x.publish("e"); // "e!"

    // Initialized with `true`?  You've got the path, as parsed, as the last parameter!
    x.subscribe("nested.event", function(){
        var path = arguments[arguments.length-1];
        console.log("Path: " + path.join("."));
    });
    x.publish("nested.event"); // "Path: nested.event"
    // Bubbles up the hierarchy, too!
    x.publish("nested.event.even.deeper.yet!"); // "Path: nested.event.even.deeper.yet!"
    // Stop the bubbling at any time!
    x.subscribe("nested.event.even", function() {
        return false;
    });
    x.publish("nested.event.even.deeper.yet!"); // nothing happens!

    // Global event listeners!
    x.subscribe("", function(){
        console.log("Event fired: " + arguments[arguments.length-1].join("."));
    });
    x.publish("an.event"); // "Event fired: an.event"

    // Unsubscribe by handler!
    var hand = function(){
        console.error("failed to remove");
    };
    x.subscribe("remove.me", hand);
    x.unsubscribe("remove.me", hand);
    x.publish("remove.me") // nothing happens!

    // Unsubscribe by path!
    x.subscribe("remove.me", hand);
    x.unsubscribe("remove.me");
    x.publish("remove.me") // nothing happens!

    // Unsubscribe recursively!
    x.subscribe("remove.me", hand);
    x.unsubscribe("remove", hand, true);
    x.publish("remove.me") // nothing happens!

    // Unsubscribe everything!
    x.subscribe("remove", hand).subscribe("another.hierarchy", hand);
    x.unsubscribe("", true);
    x.publish("remove").publish("another.hierarchy"); // nothing happens!

