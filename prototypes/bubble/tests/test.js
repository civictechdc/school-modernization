// Setup new Bubble instance for testing
var expect = chai.expect,
    bubble_test = new Bubble();

// Bubble instance sanity check
describe('Bubble Test Example', function(){
   it('should return the class of Bubble', function(){
      expect(bubble_test).to.be.instanceof(Bubble);
   });
});

// getUnique
describe('getUnique tests', function(){
    var mockData = [
        {name: 'Ally', age: 27, job: 'Developer'},
        {name: 'John', age: 25, job: 'Carpenter'},
        {name: 'Karl', age: 25, job: 'Librarian'},
        {name: 'Conner', age: 35, job: 'Developer'}
    ];

    it('should return and array', function(){
        var result = bubble_test.getUnique(mockData, 'age');
        expect(result).to.be.an('array')    ;
    });

    it('should return an array of unique, sorted items', function(){
        var ages = bubble_test.getUnique(mockData, 'age'),
            jobs = bubble_test.getUnique(mockData, 'job');
        expect(ages).to.eql([25,27,35]);
        expect(jobs).to.eql(['Carpenter', 'Developer', 'Librarian']);
    });
});

// calcMaxOccupancySums
describe('calcMaxOccupancySums tests', function(){
    var sums = bubble_test.calcMaxOccupancySums();
    
    it('should return an object', function(){   
        expect(sums).to.be.an('object');
    });

    it('should have "ward", "level", and "feederhs" properties', function(){
        expect(sums).to.have.property('level');
        expect(sums).to.have.property('feederhs');
        expect(sums).to.have.property('ward');
    });
});

// calcTotalSqFtSums
describe('calcTotalSqFtSums tests', function(){
    var sums = bubble_test.calcTotalSqFtSums();
    
    it('should return an object', function(){   
        expect(sums).to.be.an('object');
    });

    it('should have "ward", "level", and "feederhs" properties', function(){
        expect(sums).to.have.property('level');
        expect(sums).to.have.property('feederhs');
        expect(sums).to.have.property('ward');
    });
});