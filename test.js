var should = require("should");
var art = require('./async-arrays');

describe('async-arrays', function(){
    
    describe('uses forEachEmission', function(){
        
        it('to only perform one action at a time', function(complete){
            var count = 0;
            ['a', 'b', 'c', 'd', 'e'].forEachEmission(function(item, index, done){
                count++;
                count.should.equal(1);
                setTimeout(function(){
                    count--;
                    done();
                }, 300);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissions', function(){
        
        it('to perform all actions in parallel', function(complete){
            var count = 0;
            ['a', 'b', 'c', 'd', 'e'].forAllEmissions(function(item, index, done){
                count++;
                setTimeout(function(){
                    count--;
                    count.should.equal(5-(index+1));
                    done();
                }, 300 + 20*index);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissionsInPool', function(){
        
        it('to perform N actions in parallel', function(complete){
            var count = 0;
            ['a', 'b', 'c', 'd', 'e'].forAllEmissionsInPool(3, function(item, index, done){
                count++;
                setTimeout(function(){
                    count.should.not.be.above(3);
                    count--;
                    done();
                }, 300);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
});