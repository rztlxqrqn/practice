const distanceTaveller = require('../../lib/model/distanceTaveller');
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
          {name: 'C', distance: 3}, {name: 'A', distance: 4}
        ],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'C') {
      return Promise.resolve({
        name: 'C',
        directNextNodes: [],
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
describe('distanceTraveller',()=>{
  describe('constructor', ()=> {
    it('new a instance', ()=> {
      let mockParam = {
        path:['A','B','C']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      expect(traveller.__presentNodeName).to.equal('A')
    });
  });
  describe('go path',()=>{
    afterEach(()=>{
      emitter.removeAllListeners('MyTravelIsEnd');
    });
    it('success',(done)=>{
      let mockParam = {
        path:['A','B','C']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      emitter.on('MyTravelIsEnd',()=>{
        expect(traveller.__status).to.equal('HOME');
        expect(traveller.__distance).to.equal(8);
        done();
      });
      traveller.emit('TRAVEL');
    });
    it('fail1',(done)=>{
      let mockParam = {
        path:['A','B','D']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      emitter.on('MyTravelIsEnd',()=>{
        expect(traveller.__status).to.equal('LOST');
        done();
      })
      traveller.emit('TRAVEL');
    });
    it('fail2',(done)=>{
      let mockParam = {
        path:['A','B','B']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      emitter.on('MyTravelIsEnd',()=>{
        expect(traveller.__status).to.equal('LOST');
        done();
      })
      traveller.emit('TRAVEL');
    });
    it('fail3',(done)=>{
      let mockParam = {
        path:['A','D','C']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      emitter.on('MyTravelIsEnd',()=>{
        expect(traveller.__status).to.equal('LOST');
        done();
      })
      traveller.emit('TRAVEL');
    });
    it('A to A',(done)=>{
      let mockParam = {
        path:['A','B','A','B','C']
      };
      let traveller = new distanceTaveller(mockGraph,mockParam);
      emitter.on('MyTravelIsEnd',()=>{

        expect(traveller.__status).to.equal('HOME');
        done();
      })
      traveller.emit('TRAVEL');
    });
    it('one in path',(done)=>{
      let mockParam = {
        path:['A']
      };
      try{
        let traveller = new distanceTaveller(mockGraph,mockParam);
      }catch(err){
        expect(err.message).to.equal('Init distanceTaveller Error, param error');
        done()
      }
    })
  });
});
