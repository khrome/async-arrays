async-arrays.js
===============

prototype extensions for Array when using that data asynchronously

Usage
-----
I find, most of the time, my asynchronous logic emerges from an array and I really just want to be able to control the completion of some job, and have a signal for all jobs. In many instances, this winds up being more versatile than a promise which limits you to a binary state and only groups returns according to it's state. 

forEachEmission : execute serially

    [].forEachEmission(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissions : execute all jobs in parallel

    [].forAllEmissions(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissionsInPool : execute all jobs in parallel up to a maximum #, then queue for later

    [].forAllEmissionsInPool(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });

That's just about it, and even better you can open up the source and check it out yourself. Super simple.

Testing
-------
just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow