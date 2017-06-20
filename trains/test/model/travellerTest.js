const expect = require('chai').expect;
const Traveller = require('../../lib/model/traveller');
const emitter = require('../../lib/emitterFactory')();
let mockGraph = {
  getNode(name){
    if (name === 'A') {
      return Promise.resolve({
        name: 'A',
        directNextNodes: {B: 5, C: 3, D: 7},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'B') {
      return Promise.resolve({
        name: 'B',
        directNextNodes: {C: 3, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'C') {
      return Promise.resolve({
        name: 'C',
        directNextNodes: {B: 5, A: 10},
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
describe('traveller test', ()=> {
  describe('new Traveller', ()=> {
    beforeEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    });
    afterEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    })
    it('success with graph', (done)=> {
      let traveller = new Traveller(mockGraph);
      traveller.nextNodeName = 'A';
      traveller.destinationNodeName = 'C';
      emitter.on('NewTraveller', function (rr) {
        console.log(rr);

        expect(rr.presentNodeName).to.equal('A');
        expect(rr.nextNodeName).to.equal('C');
        expect(rr.record).to.eql(['A']);
        setTimeout(()=> {
          console.log(rr);

          expect(rr.presentNodeName).to.equal('C');
          expect(rr.nextNodeName).to.equal('C');
          expect(rr.record).to.eql(['A','C']);
          expect(rr.distance).to.equal(3);
        }, 500)

      });
      expect(traveller.presentNodeName).to.be.undefined;
      expect(traveller.nextNodeName).to.equal('A');
      expect(traveller.record).to.be.empty;
      expect(traveller.distance).to.equal(0);
      console.log(emitter.emit('TRAVEL'));

      setTimeout(()=> {
        // console.log(traveller);

        expect(traveller.presentNodeName).to.equal('A');
        expect(traveller.nextNodeName).to.equal('B');
        expect(traveller.record).to.eql(['A']);
        expect(traveller.distance).to.equal(0);
        done()
      }, 100)
    })
  });
  describe('isLost', ()=> {
    it('distanceLimit',()=>{
      let traveller = new Traveller(mockGraph,{param:'lessThan',number:10});
      traveller.distance=9;
      let present = {
        name: 'B',
        directNextNodes: {C: 3, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      };
      let destination = {
        name: 'B',
        directNextNodes: {C: 3, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      };
      expect(traveller.isLost(present,destination)).to.be.false;
    });
    xit('No nextStop && not destination', ()=> {
      let traveller = new Traveller(mockGraph);
      let present = {
        name: 'B',
        directNextNodes: {C: 3, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      };
      let destination = {
        name: 'B',
        directNextNodes: {C: 3, A: 4},
        isEqual(node) {
          return this.name === node.name;
        }
      };
    })
  });
  describe('small function',()=>{
    afterEach(()=>{
      emitter.removeAllListeners('Begin');
      emitter.removeAllListeners('Ready');
      emitter.removeAllListeners('NewTraveller');
      emitter.removeAllListeners('TRAVEL');
      emitter.removeAllListeners('MyTravelIsEnd');
    })
    it('getNextNodeNameInPath',()=>{
      let traveller = new Traveller(mockGraph);
      traveller.path = ['A','B','C'];
      traveller.presentNodeName = 'B';
      expect(traveller.getNextNodeNameInPath()).to.equal('C');

    });
  });
});