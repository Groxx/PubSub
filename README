###Reasons to use over [HigginsForPresident's pubsub.js](https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js):
* Regularly performs 20%-100% faster on all browsers!
* Hierarchical events, instead of single-depth!
* *Correct* unsubscribing code!  HFP's does not unsubscribe an event if it is subscribed twice in a row.
* No jQuery dependency!
###Reasons to use over jQuery's .bind and .trigger:
* Regularly performs 30x-100x faster (or more)!
* Hierarchical events, instead of "namespaces" (which mimic CSS classes, so really aren't namespaces at all)!
* No jQuery dependency!

Why am I picking on HFP's implementation?  It's the one I found when I was looking for eventing systems.  No other reason!  They even admit it was "Rewritten blindly." so this is meant in no way to be a dig at their skills.

### Example use:
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

