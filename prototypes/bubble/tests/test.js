var expect = chai.expect;
var bubble_test = new Bubble();

describe('Bubble Test Example', function(){
   it('should return the class of Bubble', function(){
      expect(bubble_test).to.be.instanceof(Bubble);
   });
});

// calcMaxOccupancySums
describe('calcMaxOccupancySums tests', function(){
    it('should return an array', function(){
        var sums = bubble_test.calcMaxOccupancySums();
        expect(sums).to.be.an('array');
    });
});