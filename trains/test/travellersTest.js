const expect = require('chai').expect;
const Travellers = require('../lib/travellers');
const emitter = require('../lib/emitterFactory')();
const Traveller = require('../lib/model/traveller');
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
describe('travellersTest', ()=> {
  describe('constructor', ()=> {
    afterEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    })
    it('构造', (done)=> {
      let traveller = new Traveller(mockGraph);
      let travellers = new Travellers(traveller);
      emitter.on('Ready', ()=> {
        travellers.getTrips().then((res)=> {
          console.log(res);
          done();
        })
      });
      emitter.emit('Begin', 'A', 'C');
    });

  });
});
