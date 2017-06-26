const distanceLimitTraveller = require('../../lib/model/distanceLimitTraveller');
const emitter = require('../../lib/emitterFactory')();
const expect = require('chai').expect;
let mockGraph = {
  getNode(name){
    if (name === 'A') {
      return Promise.resolve({
        name: 'A',
        directNextNodes: [
          {name: 'B', distance: 5}, {name: 'C', distance: 3}
        ],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'B') {
      return Promise.resolve({
        name: 'B',
        directNextNodes: [
          {name: 'C', distance: 4}, {name: 'A', distance: 2}
        ],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'C') {
      return Promise.resolve({
        name: 'C',
        directNextNodes: [{name:'D',distance:5}],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'D') {
      return Promise.resolve({
        name: 'D',
        directNextNodes: [{
          name: 'C',
          distance: 3
        }],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
  }
}
describe('distanceLimitTraveller Test', ()=> {
  describe('constructor', ()=> {
    it('new a instance', ()=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'lessThan',
        limitDistance: '10'
      };
      let traveller = new distanceLimitTraveller(mockGraph, mockParam);
      expect(traveller.__presentNodeName).to.equal('A')
    });
  });
  describe('Home Lost and duplicate', ()=> {
    afterEach(()=>{
      emitter.removeAllListeners('MyTravelIsEnd');
      emitter.removeAllListeners('NewTraveller');
    });
    it('one trip', (done)=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'lessThan',
        limitDistance: 10
      };
      let traveller = new distanceLimitTraveller(mockGraph, mockParam);

      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=> {
        expect(traveller.__record).to.eql(['A', 'B', 'C']);
        expect(traveller.__distance).to.equal(9);
        expect(traveller.__status).to.equal('HOME');
        done()
      }, 100)
    });
    it('two trips of four paths', (done)=> {
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'lessThan',
        limitDistance: 10
      };
      let traveller = new distanceLimitTraveller(mockGraph, mockParam);

      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));

      setTimeout(()=> {
        travellers = travellers.filter((traveller)=>{
          return traveller.__status === 'HOME'
        })
        expect(travellers.length).to.equal(2);
        expect(travellers[0].__name).to.equal("*");
        expect(travellers[0].__status).to.equal("HOME");
        expect(travellers[0].__record).to.eql(["A", "B", "C"]);
        expect(travellers[0].__distance).to.equal(9);
        expect(travellers[1].__name).to.equal("*A*");
        expect(travellers[1].__status).to.equal("HOME");
        expect(travellers[1].__record).to.eql(["A", "C"]);
        expect(travellers[1].__distance).to.equal(3);

        console.log(travellers.length);
        done()
      }, 1000)
    });
    it('no trip',(done)=>{
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'lessThan',
        limitDistance: 2
      };
      let traveller = new distanceLimitTraveller(mockGraph, mockParam);
      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=>{
        expect(travellers[0].__name).to.equal("*");
        expect(travellers[0].__status).to.equal("LOST");
        expect(travellers[0].__record).to.eql(["A", "B"]);
        expect(travellers[0].__distance).to.equal(5);
        expect(travellers[1].__name).to.equal("*A*");
        expect(travellers[1].__status).to.equal("LOST");
        expect(travellers[1].__record).to.eql(["A", "C"]);
        expect(travellers[1].__distance).to.equal(3);
        done()
      },100)
      

    });
  });
});
