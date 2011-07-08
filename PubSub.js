/**
Copyright 2011 by Steven Littiebrant - changes and communication about use 
appreciated but not required: https://github.com/Groxx/PubSub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.  Minified files may 
reduce this license information to the first two lines at the top of the 
LICENSE file.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 **/
;
// Creates a new subscription object.  If passed, attaches to the passed object; otherwise, assumes it was called with "new" and binds to `this`.
// If passed, unique defines the internal unique subscription list's storage name.  By default it is "_sub".
// This should be relatively safe to call even without "new" - it just makes the global object an event system.
// If true, alsoPassPath will result in the publishing-path being pushed to the end of the arguments passed to subscribers.
var PubSub = function PubSub(obj_or_alsoPassPath_or_unique, alsoPassPath_or_unique, uniqueName){
	var unique = "_sub",
	passPath = false,
	bindTo = this;
	
	if (typeof(uniqueName) === "string"){
		unique = uniqueName;
	} else if (typeof(alsoPassPath_or_unique) === "string"){
		unique = alsoPassPath_or_unique;
	} else if (typeof(obj_or_alsoPassPath_or_unique) === "string"){
		unique = obj_or_alsoPassPath_or_unique;
	}
	
	if (typeof(alsoPassPath_or_unique) === "boolean"){
		passPath = alsoPassPath_or_unique;
	} else if (typeof(obj_or_alsoPassPath_or_unique) === "boolean"){
		passPath = obj_or_alsoPassPath_or_unique;
	}
	
	if (typeof(obj_or_alsoPassPath_or_unique) === "object" || typeof(obj_or_alsoPassPath_or_unique) === "function"){
		bindTo = obj_or_alsoPassPath_or_unique;
	}
	
	// all subscriptions, nested.
	var subscriptions = {};
	subscriptions[unique] = [];
	
	// Removes all instances of handler from the passed subscription chunk.
	var _unsubscribe = function(cache, handler){
		for(var i = 0; i < cache[unique].length; i++){
			if(handler === undefined || handler === null || cache[unique][i] === handler){
				cache[unique].splice(i, 1);
				i--;
			}
		}
	};
	
	// Recursively removes all instances of handler from the passed subscription chunk.
	var _deepUnsubscribe = function(cache, handler){
		for(sub in cache){
			if(typeof(cache[sub]) !== "object" || sub === unique || !cache.hasOwnProperty(sub)) continue;
			_deepUnsubscribe(cache[sub], handler);
		}
		_unsubscribe(cache, handler);
	};
	
	// Calls all handlers on the path to the passed subscription.
	// ie, "a.b.c" would call "c", then "b", then "a".
	// If any handler returns false, the event does not bubble up (all handlers at that level are still called)
	bindTo.publish = function(sub, callback_args){
		var args;
		if (arguments.length > 2) {
			// If passing args as a set of args instead of an array, grab all but the first.
			args = Array.prototype.slice.apply(arguments, [1]); 
		} else if (callback_args) {
			args = callback_args;
		} else {
			args = [];
		} 
		if (args.length === undefined){
			args = [args];
		}
		
		var cache = subscriptions;
		var stack = [];
		sub = sub || "";
		var s = sub.split(".");
		if (passPath) args.push(s);
		stack.push(cache);
		for(var i = 0; i < s.length && s[i] !== ""; i++){
			if(cache[s[i]] === undefined) break;
			cache = cache[s[i]];
			stack.push(cache);
		}
		var c;
		var exit = false;
		while((c = stack.pop())){
			for(var j = 0; j < c[unique].length; j++){
				if(c[unique][j].apply(this,args) === false) exit = true;
			}
			if (exit) break;
		}
		return bindTo;
	};
	
	bindTo.subscribe = function(sub, handler){
		var cache = subscriptions;
		sub = sub || "";
		var s = sub.split(".");
		for(var i = 0; i < s.length && s[i] !== ""; i++){
			if (!cache[s[i]]){
				cache[s[i]] = {};
				cache[s[i]][unique] = [];
			}
			cache = cache[s[i]];
		}
		cache[unique].push(handler);
		return bindTo;
	};
	
	// Removes _all_ identical handlers from the subscription.  
	// If no handler is passed, all are removed.
	// If deep, recursively removes handlers beyond the passed sub.
	bindTo.unsubscribe = function(sub, handler, deep){
		var cache = subscriptions;
		sub = sub || "";
		if (sub != ""){
			var s = sub.split(".");
			for(var i = 0; i < s.length && s[i] !== ""; i++){
				if(cache[s[i]] === undefined) return;
				cache = cache[s[i]];
			}
		}
		if (typeof(handler) === "boolean") {
			deep = handler;
			handler = null;
		}
		
		if (deep){
			_deepUnsubscribe(cache, handler);
		} else {
			_unsubscribe(cache, handler);
		}
		return bindTo;
	};
};
