const emitter = require('../emitterFactory')();
const BaseTraveller = require('./baseTraveller');
const logger = require('../logger');
class distanceLimitTraveller extends BaseTraveller {
  constructor(graph, param, ancestor) {
    logger.debug('distanceLimitTraveller.init');
    if (!param || !param.presentNodeName || !param.destinationNodeName || !param.limitParam || !param.limitDistance) {
      throw new Error('Init DistanceLimitTraveller Error, param error')
    }
    if (param.limitParam != 'lessThan') {//目前只支持这一种参数
      throw new Error('Init DistanceLimitTraveller Error, unsupported limitParam')
    }
    super(graph, ancestor);

    this.maybeHome = false;
    this.__presentNodeName = param.presentNodeName;
    this.__record.push(this.__presentNodeName);
    this.__destinationNodeName = param.destinationNodeName;
    this.__limitParam = param.limitParam;
    this.__limitDistance = param.limitDistance;
  }

  isLost() {
    logger.debug('distanceLimitTraveller.isLost');
    //当前节点不是目的地节点且没有下一跳
    if (this.__presentNodeName != this.__destinationNodeName
      && (!Array.isArray(this.__presentNode.directNextNodes)
      || this.__presentNode.directNextNodes.length === 0)) {
      return true;
    }
    //当前已经走过的距离大于等于限制的距离
    if (this.__limitParam === 'lessThan') {
      return this.__distance >= this.__limitDistance;
    }
  }

  isHome() {
    logger.debug('distanceLimitTraveller.isHome');
    if(!this.maybeHome){
      return false;
    }
    //当前节点是目的地节点,且走过的距离小于限制距离
    if (this.__limitParam === 'lessThan') {
      if (this.__presentNodeName === this.__destinationNodeName && this.__distance < this.__limitDistance) {
        return true;
      }
    }
  }
  __getNextNode() {
    this.maybeHome=true;
    let nextNodes = this.__presentNode.directNextNodes;
    if(nextNodes.length ===0){
      return false
    }
    this.__nextNodeName = nextNodes[0].name;
    this.__distanceToNextNode = nextNodes[0].distance;
    return true;
  }

  duplicate() {
    logger.debug('distanceLimitTraveller.duplicate');
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
      let childTraveller = new distanceLimitTraveller(this.graph, {
        presentNodeName: this.__presentNodeName,
        destinationNodeName: this.__destinationNodeName,
        limitParam: this.__limitParam,
        limitDistance: this.__limitDistance
      },this.__presentNodeName+this.__name);
      childTraveller.__nextNodeName = nextNode.name;
      childTraveller.__distanceToNextNode = nextNode.distance;

      childTraveller.__record=[];
      this.__record.forEach((nodeName)=> {//此处不能直接复制,其它属性都是字符串,这个是数组,直接复制会指向同一个对象
        childTraveller.__record.push(nodeName);
      });
      childTraveller.__distance = this.__distance;
      emitter.emit('NewTraveller', childTraveller);
    })

  }
}
module.exports = distanceLimitTraveller;
