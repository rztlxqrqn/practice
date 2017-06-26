const stopsLimitTraveller = require('../../lib/model/stopsLimitTraveller');
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
        directNextNodes: [{name:'D',distance:7}],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
    if (name === 'D') {
      return Promise.resolve({
        name: 'D',
        directNextNodes: [],
        isEqual(node) {
          return this.name === node.name;
        }
      })
    }
  }
}
describe('stopsLimitTraveller Test', ()=> {
  describe('constructor', ()=> {
    it('new a instance', ()=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'exactly',
        limitStops: '10'
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);
      expect(traveller.__presentNodeName).to.equal('A')
    });
  });
  describe('Home Lost and duplicate', ()=> {
    afterEach(()=>{
      emitter.removeAllListeners('MyTravelIsEnd');
      emitter.removeAllListeners('NewTraveller');
    });
    it('one trip exactly', (done)=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'exactly',
        limitStops: 10
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);

      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=> {
        console.log(traveller);

        expect(traveller.__record).to.eql(['A', 'B', 'C','D']);
        expect(traveller.__distance).to.equal(16);
        expect(traveller.__status).to.equal('LOST');
        done()
      }, 100)
    });
    it('one trip maximum', (done)=> {
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'maximum',
        limitStops: 3
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);

      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=> {
        expect(traveller.__record).to.eql(['A','B','C']);
        expect(traveller.__distance).to.equal(9);
        expect(traveller.__status).to.equal('HOME');
        done()
      }, 100)
    });
    it('four trips maximum', (done)=> {
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'maximum',
        limitStops: 5
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);

      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));

      setTimeout(()=> {
        let real = travellers.filter((traveller)=>{
          return traveller.__status === 'HOME';
        })
        expect(real.length).to.equal(4);
        expect(real[0].__name).to.equal("*");
        expect(real[0].__status).to.equal("HOME");
        expect(real[0].__record).to.eql(["A", "B", "C"]);
        expect(real[0].__distance).to.equal(9);
        expect(real[1].__name).to.equal("*C*");
        expect(real[1].__status).to.equal("HOME");
        expect(real[1].__record).to.eql(["A", "C"]);
        expect(real[1].__distance).to.equal(3);
        expect(real[2].__name).to.equal("*A*");
        expect(real[2].__status).to.equal("HOME");
        expect(real[2].__record).to.eql(["A", "B", "A", "B","C"]);
        expect(real[2].__distance).to.equal(16);
        expect(real[3].__name).to.equal("*C*A*");
        expect(real[3].__status).to.equal("HOME");
        expect(real[3].__record).to.eql(["A", "B", "A", "C"]);
        expect(real[3].__distance).to.equal(10);
        done()
      }, 1000)
    });
    it('one trip exactly', (done)=> {
      let travellers = [];
      emitter.on('NewTraveller', (newTraveller)=> {
        travellers.push(newTraveller);
        newTraveller.emit('TRAVEL');

        // expect(newTravellerGen())
      });
      let mockParam = {
        presentNodeName: 'A',
        destinationNodeName: 'C',
        limitParam: 'exactly',
        limitStops: 5
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);

      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));

      setTimeout(()=> {
        console.log(travellers.length);

        let real = travellers.filter((traveller)=>{
          return traveller.__status === 'HOME';
        })
        expect(real.length).to.equal(1);
        expect(real[0].__name).to.equal("*A*");
        expect(real[0].__status).to.equal("HOME");
        expect(real[0].__record).to.eql(["A", "B", "A", "B","C"]);
        expect(real[0].__distance).to.equal(16);
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
        destinationNodeName: 'D',
        limitParam: 'exactly',
        limitStops: 2
      };
      let traveller = new stopsLimitTraveller(mockGraph, mockParam);
      travellers.push(traveller);
      console.log(traveller.emit('TRAVEL'));
      setTimeout(()=>{
        let real = travellers.filter((traveller)=>{
          return traveller.__status === 'HOME';
        })
        expect(real.length).to.equal(0);
        done()
      },100)


    });
  });
});
