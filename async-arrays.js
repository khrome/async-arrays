(function(){
    // convenience method that performs a forEach with no closure at the speed of a 'for'
    // be careful, as this is subject to the same async gotchas as the language 'for'
    if(!Array.prototype.uForEach) Array.prototype.uForEach = function(callback){
        var len = this.length;
        for (var j = 0; j < len; j++) {
            callback(this[j], j);
        }
    };

    // allows you to act on each member in an array one at a time 
    // (while being able to perform asynchronous tasks internally)
    if(!Array.prototype.forEachEmission) Array.prototype.forEachEmission = function(callback, complete){
        var a = {count : 0};
        var collection = this;
        var returnArgs = [];
        var fn = function(collection, callback, complete){
            if(a.count >= collection.length){
                if(complete) complete.apply(complete, returnArgs);
            }else{
                callback(collection[a.count], a.count, function(){
                    var args = Array.prototype.slice.apply(arguments, [0]);
                    if(args.length == 1) returnArgs[a.count] = args[0];
                    if(args.length > 1) returnArgs[a.count] = args;
                    a.count++;
                    fn(collection, callback, complete);
                });
            }
        };
        fn(collection, callback, complete);
    };

    //allows you to act on each member in a chain in parallel
    if(Array.prototype.forAllEmissions) Array.prototype.forAllEmissions = function(callback, complete){
        var a = {count : 0};
        var collection = this;
        var returnArgs = [];
        var begin = function(){
            a.count++;
        };
        var finish = function(index, args){
            if(args.length == 1) returnArgs[index] = args[0];
            if(args.length > 1) returnArgs[index] = args;
            a.count--;
            if(a.count == 0 && complete) complete.apply(complete, returnArgs);
        };
        object.forEach(collection, function(value, key){
            begin();
            callback(value, key, function(){
               finish(key, Array.prototype.slice.apply(arguments, [0])); 
            });
        });
    };

    //allows you to act on each member in a pool, with a maximum number of active jobs until complete
    if(Array.prototype.forAllEmissionsInPool) Array.prototype.forAllEmissionsInPool = function(poolSize, callback, complete){
        var a = {count : 0};
        var collection = this;
        var queue = [];
        var activeCount = 0;
        var returnArgs = [];
        var begin = function(action){
            a.count++;
            if(activeCount >= poolSize){
                queue.push(action)
            }else{
                action();
            }
        };
        var finish = function(index, args){
            if(args.length == 1) returnArgs[index] = args[0];
            if(args.length > 1) returnArgs[index] = args;
            a.count--;
            if(queue.length > 0){
                queue.shift()();
            }else if(a.count == 0 && complete) complete.apply(complete, returnArgs);
        };
        object.forEach(collection, function(value, key){
            begin(function(){
                callback(value, key, function(){
                   finish(key, Array.prototype.slice.apply(arguments, [0])); 
                });
            });
        });
    };
    
})();