const TravellersManager = require('../lib/travellersManager');
const expect = require('chai').expect;
const sinon = require('sinon');
const _ = require('lodash');
const EventEmitter = require('events');
const emitter = require('../lib/emitterFactory')();

describe('travellersManager',()=>{
  describe('constructor',()=>{
    it('success',()=>{
      let tm1 = TravellersManager();
      let tm2 = TravellersManager();
      expect(Object.is(tm1,tm2)).to.be.true;
    });
  });
  describe('begin',()=>{
    afterEach(()=>{
      emitter.removeAllListeners('MyTravelIsEnd');
      emitter.removeAllListeners('NewTraveller');
    });
    it('success',()=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      let spy = sinon.spy();
      em.on('TRAVEL',spy);
      tm.begin('testType',{getNode:function(){}},{});
      expect(spy.calledOnce).to.be.true;
    });
    it('param check',()=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin({},{getNode:function(){}},{});
      }catch(err){
        expect('TravellersManager is not able to work! Because travellerType is not a string')
          .to.equal(err.message);
      }
    });
    it('MyTravelIsEnd',()=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin('testType',{getNode:function(){}},{});
      }catch(err){
        expect(err).to.be.null;
      }
      expect(Object.is(tm.travellers[0],em)).to.be.true;

      emitter.emit('MyTravelIsEnd');
    });
    it('NewTraveller',()=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin('testType',{getNode:function(){}},{});
      }catch(err){
        expect(err).to.be.null;
      }
      expect(Object.is(tm.travellers[0],em)).to.be.true;

      let em2 = new EventEmitter();
      let spy = sinon.spy();
      em2.on('TRAVEL',spy);
      expect(tm.travellers.length).to.equal(1);
      emitter.emit('NewTraveller',em2);

      expect(spy.calledOnce).to.be.true;
      expect(tm.travellers.length).to.equal(2);
    });
  });
  describe('getTrips',()=>{
    afterEach(()=>{
      emitter.removeAllListeners('MyTravelIsEnd');
      emitter.removeAllListeners('NewTraveller');
    });
    it('one Traveller',(done)=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin('testType',{getNode:function(){}},{});
      }catch(err){
        expect(err).to.be.null;
      }
      let em2 = {
        __status:'HOME',
        getRecord:()=>{
          return ['1','2']
        },
        getDistance:()=>{
          return 5
        }
      };
      em2.__proto__ = new EventEmitter();
      expect(tm.travellers.length).to.equal(1);

      emitter.emit('NewTraveller',em2);
      
      setTimeout(()=>{

        expect(tm.getTrips()).to.eql([ { record: [ '1', '2' ], distance: 5 }])
        done()
      },1000)
    });
    it('two Traveller',(done)=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin('testType',{getNode:function(){}},{});
      }catch(err){
        expect(err).to.be.null;
      }
      let em2 = {
        __status:'HOME',
        getRecord:()=>{
          return ['1','2']
        },
        getDistance:()=>{
          return 5
        }
      };
      em2.__proto__ = new EventEmitter();
      let em3 = {
        __status:'HOME',
        getRecord:()=>{
          return ['2','3']
        },
        getDistance:()=>{
          return 6
        }
      };
      em3.__proto__ = new EventEmitter();
      let spy = sinon.spy();
      em3.on('TRAVEL',spy);
      expect(tm.travellers.length).to.equal(1);
      emitter.emit('NewTraveller',em2);
      emitter.emit('NewTraveller',em3);
      setTimeout(()=>{
        expect(tm.getTrips()).to.eql([ { record: [ '1', '2' ], distance: 5 },
          { record: [ '2', '3' ], distance: 6 } ])
        done()
      },1000)
    });
    it('three Traveller, one of them is LOST',(done)=>{
      let tm = TravellersManager();
      let em = new EventEmitter();
      tm.travellerFactory = function () {
        return em;
      };
      try{
        tm.begin('testType',{getNode:function(){}},{});
      }catch(err){
        expect(err).to.be.null;
      }
      let em1 = {
        __status:'LOST',
        getRecord:()=>{
          return ['1','2']
        },
        getDistance:()=>{
          return 5
        }
      };
      em1.__proto__ = new EventEmitter();
      
      let em2 = {
        __status:'HOME',
        getRecord:()=>{
          return ['1','2']
        },
        getDistance:()=>{
          return 5
        }
      };
      em2.__proto__ = new EventEmitter();
      
      let em3 = {
        __status:'HOME',
        getRecord:()=>{
          return ['2','3']
        },
        getDistance:()=>{
          return 6
        }
      };
      em3.__proto__ = new EventEmitter();
      
      let spy = sinon.spy();
      em3.on('TRAVEL',spy);
      expect(tm.travellers.length).to.equal(1);
      emitter.emit('NewTraveller',em1);
      emitter.emit('NewTraveller',em2);
      emitter.emit('NewTraveller',em3);
      setTimeout(()=>{
        expect(tm.getTrips()).to.eql([ { record: [ '1', '2' ], distance: 5 },
          { record: [ '2', '3' ], distance: 6 } ])
        done()
      },1000)
    });
  });
});
