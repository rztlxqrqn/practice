const expect = require('chai').expect;
const emitter = require('../lib/emitterFactory')();
const Calculate = require('../lib/calculate');
const Distance = require('../lib/distance');
const ShortestTrip = require('../lib/shortestTrip');
const TripsWithDistanceLimit = require('../lib/tripsWithDistanceLimit');
const TripsWithStopsLimit = require('../lib/tripsWithStopsLimit');
const _ = require('lodash');
let mockGraph = {
  getNode(name){
    if (name === 'A') {
      return Promise.resolve({
        name: 'A',
        directNextNodes: {B: 5, C: 3},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'B') {
      return Promise.resolve({
        name: 'B',
        directNextNodes: {C: 3,D:7, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'C') {
      return Promise.resolve({
        name: 'C',
        directNextNodes: {},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'D') {
      return Promise.resolve({
        name: 'D',
        directNextNodes: {C: 3},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
  }
}
describe('Calculate', ()=> {
  describe('CalculateSelf', ()=> {
    afterEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    })
    it('all path between node', ()=> {
      let selfGraph = _.cloneDeep(mockGraph)
      let calculate = new Calculate(selfGraph);
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);
          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 },
            { record: [ 'A', 'C' ], distance: 3 },
            { record: [ 'A', 'B', 'D', 'C' ], distance: 15 } ])
        })
    });
    it('distance limit lessThan', ()=> {
      let calculate = new Calculate(mockGraph);
      calculate.distanceLimit = {
        param:'lessThan',
        number:10
      };
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);
      
          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 },
            { record: [ 'A', 'C' ], distance: 3 } ])
        })
    });
    it('stop limit maximum', ()=> {
      let calculate = new Calculate(mockGraph);
      calculate.stopLimit = {
        param:'maximum',
        number:3
      };
      return calculate.getTrips('A','C')
        .then((trips)=>{


          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 },
            { record: [ 'A', 'C' ], distance: 3 },
            { record: [ 'A', 'B', 'D', 'C' ], distance: 15 },
            { record: [ 'A', 'B', 'A', 'C' ], distance: 12 } ])
        })
    });
    it('stop limit exactly', ()=> {
      let calculate = new Calculate(mockGraph);
      calculate.stopLimit = {
        param:'exactly',
        number:3
      };
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);
          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 } ])
        })
    });
    it('path', ()=> {
      let calculate = new Calculate(mockGraph);
      calculate.path = ['A','B','C'];
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);

          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 } ])
        })
    });

  });
  describe('others', ()=> {
    afterEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    })
    it('shortest', ()=> {
      let calculate = new ShortestTrip(mockGraph);
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);
          expect(trips).to.eql(
            { record: [ 'A', 'C' ], distance: 3 }
            )
        })
    });
    it('distance limit lessThan', ()=> {
      let calculate = new TripsWithDistanceLimit(mockGraph,{
        param:'lessThan',
        number:10
      });
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);

          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 },
            { record: [ 'A', 'C' ], distance: 3 } ])
        })
    });
    it('stop limit maximum', ()=> {
      let calculate = new TripsWithStopsLimit(mockGraph,{
        param:'maximum',
        number:3
      });
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log('xxxxxxxxxxxxxx');

          console.log(trips);

          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 },
            { record: [ 'A', 'C' ], distance: 3 },
            { record: [ 'A', 'B', 'D', 'C' ], distance: 15 },
            { record: [ 'A', 'B', 'A', 'C' ], distance: 12 } ])
        })
    });
    it('stop limit exactly', ()=> {
      let calculate = new TripsWithStopsLimit(mockGraph,{
        param:'exactly',
        number:3
      });
      return calculate.getTrips('A','C')
        .then((trips)=>{
          console.log(trips);

          expect(trips).to.eql([ { record: [ 'A', 'B', 'C' ], distance: 8 } ])
        })
    });
    it('path', ()=> {
      let calculate = new Distance(mockGraph,['A','B','C']);
      return calculate.getTrips('A','C')
        .then((distance)=>{
          console.log(distance);

          expect(distance).to.equal(8)
        })
    });

  });
});

