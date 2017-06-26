const emitter = require('../emitterFactory')();
const EventEmitter = require('events');
const logger = require('../logger');
class baseTraveller extends EventEmitter{
  constructor(graph,ancestor) {
    super();
    this.__name = ancestor?'*' + ancestor:'*';
    logger.debug('A New Traveller Is Created! Name Is ' + this.__name);
    this.__status = 'TRAVELING';
    this.__presentNode = undefined;
    this.__presentNodeName = undefined;
    this.__destinationNodeName = undefined;
    this.__nextNodeName = undefined;
    this.__distanceToNextNode = 0;

    this.__record = [];
    this.__distance = 0;
    
    this.graph = graph;

    this.readyToGo()

  }

  getRecord() {
    logger.debug('getRecord');
    return this.__record;
  };

  getDistance() {
    logger.debug('getDistance');
    return this.__distance
  };

  setNextNodeName(nodeName) {
    logger.debug('setNextNodeName');
    this.__nextNodeName = nodeName;
  }

  setDestinationNodeName(nodeName) {
    logger.debug('setDestinationNodeName');
    this.__destinationNodeName = nodeName;
  }

  goHome() {
    logger.debug(this.__name + ' GO HOME!');
    this.__status = 'HOME';
    emitter.emit('MyTravelIsEnd');
  }

  lost() {//设置自身状态为LOST
    logger.debug(this.__name + ' LOST!');
    this.__status = 'LOST';
    emitter.emit('MyTravelIsEnd');

  }


  readyToGo() {//监听TRAVEL事件一次
    this.once('TRAVEL', ()=> {
      logger.debug('baseTraveller get event TRAVEL');
      logger.debug(this.__name + ' traveller record ' + JSON.stringify(this.__record) );

      //判断状态
      if (this.__status !== 'TRAVELING') {
        return;
      }
      //处理
      return this.travel()
        .then(()=> {
          this.emit('TRAVEL')
        })
        .catch((err)=>{
          console.log(err);

        })
    })
  }
  
  isHome() {
  }

  isLost() {
  }

  travel() {
    return this.getPresent()
      .then(()=>{
        if(!this.__nextNodeName){
          this.__getNextNode();
          this.duplicate();
        }
        this.changeStatus();
        if(this.__status === 'TRAVELING'){
          this.move();
        }
      })
      .catch((err)=>{
        console.log(err);

      })
  }

  move() {
    logger.debug('baseTraveller.move');
    this.__distance = this.__distance + this.__distanceToNextNode;
    this.__presentNodeName = this.__nextNodeName;
    this.__distanceToNextNode = 0;
    this.__nextNodeName = undefined;
    this.__record.push(this.__presentNodeName);
  }

  changeStatus() {
    logger.debug('baseTraveller.changeStatus');
    if (this.isLost()) {
      return this.lost();
    }
    if (this.isHome()) {
      return this.goHome();
    }
    return this.readyToGo();
  }

  duplicate() {
  }

  getPresent(){

    return this.graph.getNode(this.__presentNodeName).then((node)=>{
      this.__presentNode = node;
    })
  }
  __getNextNode(){}

}
module.exports = baseTraveller;
