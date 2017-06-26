const emitter = require('../emitterFactory')();
const BaseTraveller = require('./baseTraveller');
const logger = require('../logger');
class stopsLimitTraveller extends BaseTraveller {
  constructor(graph, param, ancestor) {
    logger.debug('stopsLimitTraveller.init');
    if (!param || !param.presentNodeName || !param.destinationNodeName || !param.limitParam || !param.limitStops) {
      throw new Error('Init stopsLimitTraveller Error, param error')
    }
    if (param.limitParam != 'exactly' && param.limitParam != 'maximum') {//目前只支持2种参数
      throw new Error('Init stopsLimitTraveller Error, unsupported limitParam')
    }
    super(graph, ancestor);

    this.maybeHome = false;
    this.__presentNodeName = param.presentNodeName;
    this.__record.push(this.__presentNodeName);
    this.__destinationNodeName = param.destinationNodeName;
    this.__limitParam = param.limitParam;
    this.__limitStops = param.limitStops;
  }

  isLost() {
    // console.log(this);

    logger.debug('stopsLimitTraveller.isLost');
    //当前节点不是目的地节点且没有下一跳
    if (this.__presentNodeName != this.__destinationNodeName
      && (!Array.isArray(this.__presentNode.directNextNodes)
      || this.__presentNode.directNextNodes.length === 0)) {
      return true;
    }
    //当前已经走过的node数大于限制的数量
    if (this.__limitParam === 'maximum') {
      return this.__record.length > this.__limitStops;
    }
    if (this.__limitParam === 'exactly') {
      return this.__record.length > this.__limitStops;
    }
  }

  isHome() {
    logger.debug('stopsLimitTraveller.isHome');
    //当前节点是目的地节点,且走过的距离小于限制距离
    if(!this.maybeHome){
      return false;
    }
    if (this.__limitParam === 'maximum') {
      if (this.__presentNodeName === this.__destinationNodeName && this.__record.length <= this.__limitStops) {
        return true;
      }
    }
    if (this.__limitParam === 'exactly') {
      if (this.__presentNodeName === this.__destinationNodeName && this.__record.length === this.__limitStops) {
        return true;
      }
    }
  }

  __getNextNode() {
    this.maybeHome = true;
    let nextNodes = this.__presentNode.directNextNodes;
    if (nextNodes.length === 0) {
      return false
    }
    this.__nextNodeName = nextNodes[0].name;
    this.__distanceToNextNode = nextNodes[0].distance;
    return true;
  }

  duplicate() {
    logger.debug('stopsLimitTraveller.duplicate');
    if (this.isLost()) {//本身已经LOST,不可能有后代
      return;
    }
    let nextNodes = [];
    if (this.isHome()) {//本身已经到达终点,每个不同的下一跳都分配一个后代
      nextNodes = this.__presentNode.directNextNodes;

    } else {//本身没有到达终点,自己沿着下一跳中的第一个继续移动,其余的下一跳每一个分配一个后代
      nextNodes = this.__presentNode.directNextNodes.slice(1);//去掉第一个
    }
    nextNodes.forEach((nextNode)=> {
      let childTraveller = new stopsLimitTraveller(this.graph, {
        presentNodeName: this.__presentNodeName,
        destinationNodeName: this.__destinationNodeName,
        limitParam: this.__limitParam,
        limitStops: this.__limitStops
      }, nextNode.name + this.__name);
      childTraveller.__nextNodeName = nextNode.name;
      childTraveller.__distanceToNextNode = nextNode.distance;

      childTraveller.__record = [];
      this.__record.forEach((nodeName)=> {//此处不能直接复制,其它属性都是字符串,这个是数组,直接复制会指向同一个对象
        childTraveller.__record.push(nodeName);
      });
      childTraveller.__distance = this.__distance;
      emitter.emit('NewTraveller', childTraveller);
    })

  }
}
module.exports = stopsLimitTraveller;
