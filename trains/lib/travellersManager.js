const emitter = require('./emitterFactory')();
const EventEmitter = require('events');
const travellerFactory = require('./travellerFactory');
const logger = require('./logger');

class travellersManager extends EventEmitter{
  constructor() {
    logger.debug('travellersManager init');
    super();
    this.travellerFactory = travellerFactory;
    this.emitter = emitter;
    this.travellers = [];
  }
  begin(travellerType,graph,param){
    logger.debug('travellersManager.begin');
    if(!(arguments.length===3)){
      throw new Error('TravellersManager is not able to work! Because arguments length is not 3')
    }
    if(!(typeof travellerType === 'string')){
      throw new Error('TravellersManager is not able to work! Because travellerType is not a string')
    }
    if(!(typeof graph.getNode === 'function')){
      throw new Error('TravellersManager is not able to work! Because graph has not getNode function')
    }
    if(!(typeof param === 'object')){
      throw new Error('TravellersManager is not able to work! Because param is not a object')
    }
    //某个traveller的任务结束了(LOST 或者  HOME)
    emitter.on('MyTravelIsEnd', ()=> {
      logger.debug('One traveller is end!');
    });
    //分裂出了新的traveller
    emitter.on('NewTraveller', (traveller)=> {
      logger.debug('New traveller request!');
      let newTraveller = traveller;
      this.travellers.push(newTraveller);

      newTraveller.emit('TRAVEL')
    });
    let firstTraveller = this.travellerFactory(travellerType,graph,param);
    this.travellers = [firstTraveller];
    logger.debug('Travellers start work!');
    firstTraveller.emit('TRAVEL');
  }

  getTrips() {
    logger.debug('travellersManager.getTrips');


    let trips = [];

    this.travellers.forEach((traveller)=> {
      
      if (traveller.__status === 'HOME') {
        trips.push({
          record: traveller.getRecord(),
          distance: traveller.getDistance()
        })
      }
    });

    return trips;
  }
}
let manager = undefined;
module.exports = function () {
  if(manager){
    return manager;
  }
  manager = new travellersManager();
  return manager;
};



