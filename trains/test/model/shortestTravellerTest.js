const shortestTraveller = require('../../lib/model/shortestTraveller');
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
          {name: 'C', distance: 4}, {name: 'A', distance: 2},{name:'F',distance:6}
        ],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'C') {
      return Promise.resolve({
        name: 'C',
        directNextNodes: [{name:'E',distance:7}],
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
    if (name === 'E') {
      return Promise.resolve({
        name: 'E',
        directNextNodes: [],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'F') {
      return Promise.resolve({
        name: 'F',
        directNextNodes: [],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
  }
};
describe('shortestTraveller test',()=>{
  describe('constructor',()=>{
    it('new a instance', ()=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C'
      };
      let traveller = new shortestTraveller(mockGraph, mockParam);
      expect(traveller.__presentNodeName).to.equal('A')
    });
  });
  describe('Home Lost and duplicate',()=>{
    it('only one',(done)=>{
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'E'
      };
      let traveller = new shortestTraveller(mockGraph, mockParam);
      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=>{
        console.log(travellers);
        done()
      },1000)
    });
    it('two trips of three paths',(done)=>{
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C'
      };
      let traveller = new shortestTraveller(mockGraph, mockParam);
      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=>{
        console.log(travellers.length);
        console.log(travellers);

        done()
      },1000)
    });
    it('no trips',(done)=>{
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'D'
      };
      let traveller = new shortestTraveller(mockGraph, mockParam);
      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=>{
        console.log(travellers.length);
        console.log(travellers);

        done()
      },1000)
    })
  });
});
