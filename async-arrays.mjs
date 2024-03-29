// SORRY THE SOURCE IS DOUBLE INCLUDED 
// Blame the maintainers of node.js and the brainfucked build-oriented hell they
// created in order to plug into massive corporate build systems who don't intend 
// on using node for anything but UI coding and pipe glue. Spoiler: doing types
// in Rust is not going to change anything. It was always FUD that ends with C#.
// RANT OVER
import * as sift from 'sift';

export const forAllEmissionsInPool = function(array, poolSize, callback, complete){
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
    Array.prototype.forEach.apply(array, [function(value, key){
        begin(function(){
            callback(value, key, function(){
               finish(key, Array.prototype.slice.apply(arguments, [0])); 
            });
        });
    }]);
    if(a.count == 0 && complete) complete.apply(complete, returnArgs);
};

export const forAllEmissions = function(list, callback, complete){
    var ref = {count : 0};
    Array.prototype.forEach.apply(list, [function(value, key){
        ref.count++;
        setTimeout(function(){
            callback(value, key, function(){
                    ref.count--;
                    if(ref.count < 0) throw new Error('continued iterating past stop');
                    if(ref.count == 0) return complete();
            });
        },1);
    }]);
    if(!list.length) complete();
};

export const mapEmissions = function(list, callback, complete, parallel){
    var results = [];
    var fnName = parallel?'forAllEmissions':'forEachEmission';
    asyncarray[fnName](list, function(item, index, done){
        callback(item, function(item){
           if(item) results.push(item);
           done();
        });
    }, function(){
        complete(results);
    });
};

export const forEachEmission = function(array, callback, complete){
    var a = {count : 0};
    var collection = array;
    var returnArgs = [];
    var len = collection.length;
    var fn = function(collection, callback, complete){
        if(a.count >= collection.length){
            setTimeout(function(){
                if(complete) complete.apply(complete, returnArgs);
            },1); return;
        }else{
            setTimeout(function(){
                callback(collection[a.count], a.count, function(){
                    var args = Array.prototype.slice.apply(arguments, [0]);
                    if(args.length == 1) returnArgs[a.count] = args[0];
                    if(args.length > 1) returnArgs[a.count] = args;
                    a.count++;
                    fn(collection, callback, complete);
                });
            },1);
        }
    };
    fn(collection, callback, complete);
};

export const uForEach = function(array, callback){
    var len = array.length;
    for (var j = 0; j < len; j++) {
        callback(array[j], j);
    }
};

export const combine = function(thisArray, thatArray){ //parallel
    var result = [];
    Array.prototype.forEach.apply(thisArray, [function(value, key){
        if(result.indexOf[value] === -1) result.push(value);
    }]);
    Array.prototype.forEach.apply(thatArray, [function(value, key){
        if(result.indexOf[value] === -1) result.push(value);
    }]);
    return result;
};

export const contains = function(haystack, needle){
    if(typeof needle == 'array'){
        result = false;
        Array.prototype.forEach.apply(needle, [function(pin){
            result = result || object.contains(haystack, pin);
        }]);
        return result;
    }
    else return haystack.indexOf(needle) != -1;
};

export const delta = function(a, b){
    var delta = [];
    Array.prototype.forEach.apply(a, [function(item){
        if(b.indexOf(item) != -1) delta.push(item);
    }]);
    Array.prototype.forEach.apply(b, [function(item){
        if(a.indexOf(item) != -1 && delta.indexOf(item) == -1) delta.push(item);
    }]);
    return delta;
};

//mutators (return modified elements)
export const erase = function(arr, field){
    if(typeof field != 'object'){
        var index;
        var item;
        while((index = arr.indexOf(field)) != -1){ //get 'em all
            item = arr[index];
            arr.splice(index, 1); //delete the one we found
        }
        return item;
    }else{
        var filter = sift(field);
        var filtered = [];
        for(var i = arr.length; i--; ){
            if(filter.test(arr[i])){
                filtered.push(arr[i]);
                arr.splice(i, 1);
            }
        }
        return filtered;
    }
};

export const empty = function(arr){
    var removed = arr.slice(0);
    arr.splice(0, arr.length);
    return removed;
};

export const proto = function(){
    if(!Array.prototype.uForEach) Array.prototype.uForEach = function(callback){
        return asyncarray.uForEach(this, callback);
    };

    // allows you to act on each member in an array one at a time 
    // (while being able to perform asynchronous tasks internally)
    if(!Array.prototype.forEachEmission){
        Array.prototype.forEachEmission = function(callback, complete){
            return forEachEmission(this, callback, complete);
        };
    }

    //allows you to act on each member in a chain in parallel
    if(!Array.prototype.forAllEmissions){
        Array.prototype.forAllEmissions = function(callback, complete){
            return forAllEmissions(this, callback, complete);
        };
    }

    //allows you to act on each member in a pool, with a maximum number of active jobs until complete
    if(!Array.prototype.forAllEmissionsInPool){
        Array.prototype.forAllEmissionsInPool = function(poolSize, callback, complete){
            return forAllEmissionsInPool(this, poolSize, callback, complete);
        };
    }
    
    //map an array, asynchronously
    if(!Array.prototype.mapEmissions){
        Array.prototype.mapEmissions = function(poolSize, callback, complete){
            return mapEmissions(this, poolSize, callback, complete);
        };
    }
    if(!Array.prototype.combine) Array.prototype.combine = function(array){
        return combine(this, array);
    };
    if(!Array.prototype.contains) Array.prototype.contains = function(item){
        return contains(this, item);
    };
    if(!Array.prototype.erase) Array.prototype.erase = function(field){
        return erase(this, field);
    };
    if(!Array.prototype.empty) Array.prototype.empty = function(field){
        return empty(this, field);
    };
};

export const forEachBatch = forAllEmissionsInPool
export const forEach = forAllEmissionsInPool
export const forAll = forAllEmissionsInPool
export const map = mapEmissions
map.each = function(list, callback, complete){
    return asyncarray.mapEmissions(list, callback, complete);
}
map.all = function(list, callback, complete){
    return asyncarray.mapEmissions(list, callback, complete, true);
}