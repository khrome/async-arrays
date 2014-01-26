(function(){
    module.exports = {
        forAllEmissionsInPool : function(array, poolSize, callback, complete){
            var a = {count : 0};
            var collection = array;
            var queue = [];
            var activeCount = 0;
            var returnArgs = [];
            var begin = function(action){
                if(a.count >= poolSize){
                    queue.push(action)
                }else{
                    a.count++;
                    action();
                }
            };
            var finish = function(index, args){
                if(args.length == 1) returnArgs[index] = args[0];
                if(args.length > 1) returnArgs[index] = args;
                a.count--;
                if(queue.length > 0){
                    a.count++;
                    queue.shift()();
                }else if(a.count == 0 && complete) complete.apply(complete, returnArgs);
            };
            array.forEach(function(value, key){
                begin(function(){
                    callback(value, key, function(){
                       finish(key, Array.prototype.slice.apply(arguments, [0])); 
                    });
                });
            });
        },
        forAllEmissions : function(array, callback, complete){
            var a = {count : 0};
            var collection = array;
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
            array.forEach(function(value, key){
                begin();
                callback(value, key, function(){
                   finish(key, Array.prototype.slice.apply(arguments, [0])); 
                });
            });
        },
        forEachEmission : function(array, callback, complete){
            var a = {count : 0};
            var collection = array;
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
        },
        uForEach : function(array, callback){
            var len = array.length;
            for (var j = 0; j < len; j++) {
                callback(array[j], j);
            }
        },
        combine : function(thisArray, thatArray){ //parallel
            var result = [];
            array.forEach(thatArray, function(value, key){
                result.push(value);
            });
            return result;
        },
        contains : function(haystack, needle){
            if(typeof needle == 'array'){
                result = false;
                needle.forEach(function(pin){
                    result = result || object.contains(haystack, pin);
                });
                return result;
            }
            else return haystack.indexOf(needle) != -1;
        },
        erase : function(arr, field){
            var index;
            while((arr.indexOf(field)) != -1){ //get 'em all
                arr.splice(index, 1); //delete the one we found
            }
        },
        //TODO: mutators
        proto : function(){
            // convenience method that performs a forEach with no closure at the speed of a 'for'
            // be careful, as this is subject to the same async gotchas as the language 'for'
            if(!Array.prototype.uForEach) Array.prototype.uForEach = function(callback){
                return module.exports.uForEach(this, callback);
            };

            // allows you to act on each member in an array one at a time 
            // (while being able to perform asynchronous tasks internally)
            if(!Array.prototype.forEachEmission) Array.prototype.forEachEmission = function(callback, complete){
                return module.exports.forEachEmission(this, callback, complete);
            };

            //allows you to act on each member in a chain in parallel
            if(!Array.prototype.forAllEmissions) Array.prototype.forAllEmissions = function(callback, complete){
                return module.exports.forAllEmissions(this, callback, complete);
            };

            //allows you to act on each member in a pool, with a maximum number of active jobs until complete
            if(!Array.prototype.forAllEmissionsInPool) Array.prototype.forAllEmissionsInPool = function(poolSize, callback, complete){
                return module.exports.forAllEmissionsInPool(this, poolSize, callback, complete);
            };
            if(!Array.prototype.combine) Array.prototype.combine = function(array){
                return module.exports.combine(this, array);
            };
            if(!Array.prototype.contains) Array.prototype.contains = function(item){
                return module.exports.contains(this, item);
            };
            if(!Array.prototype.erase) Array.prototype.erase = function(field){
                return module.exports.erase(this, field);
            };
        }
    }
})();