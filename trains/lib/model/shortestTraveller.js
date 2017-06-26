const BaseTraveller = require('./baseTraveller');
const emitter = require('../emitterFactory')();
const logger = require('../logger');
class shortestTraveller extends BaseTraveller {
  constructor(graph, param, ancestor) {
    logger.debug('shortestTraveller.init');
    if (!param || !param.presentNodeName || !param.destinationNodeName) {
      throw new Error('Init DistanceLimitTraveller Error, param error');
    }
    super(graph, ancestor);
    this.__fromNodeName = param.fromNodeName || param.presentNodeName;
    this.__presentNodeName = param.presentNodeName;
    this.__record.push(this.__presentNodeName);
    this.__destinationNodeName = param.destinationNodeName;
  }

  isLost() {
    logger.debug('shortestTraveller.isLost');

    if (this.__presentNodeName === this.__destinationNodeName) {
      return false;
    }

    //如果走到某一步,后续节点中没有需要的节点
    if (!Array.isArray(this.__presentNode.directNextNodes)
      || this.__getUseFulNext().length===0) {
      return true;
    }
    return false;
  }

  isHome() {
    if(this.__record.length===1){
      return false;
    }
    return this.__presentNodeName === this.__destinationNodeName;
  }

  __getNextNode() {

    let nextNodes = this.__getUseFulNext();

    if(nextNodes.length ===0){
      return false
    }
    this.__nextNodeName = nextNodes[0].name;
    this.__distanceToNextNode = nextNodes[0].distance;
    return true;
  }

  __getUseFulNext(num) {
    let result = [];
    if(this.__fromNodeName === this.__destinationNodeName){
      let tempRecord = this.__record.slice(1);

      this.__presentNode.directNextNodes.forEach((node)=> {
        if (tempRecord.every((name)=> {return name != node.name;})) {
          result.push({
            name:node.name,
            distance:node.distance
          })
        }
      });
    }else{
      this.__presentNode.directNextNodes.forEach((node)=> {
        if (this.__record.every((name)=> {return name != node.name;})) {
          result.push({
            name:node.name,
            distance:node.distance
          })
        }
      });
    }
    return result;
  }
  duplicate() {
    logger.debug('distanceLimitTraveller.duplicate');
    if (this.isLost()) {//本身已经LOST,不可能有后代
      return;
    }
    let nextNodes = [];
    if (this.isHome()) {//本身已经到达终点,不需要有后代
      return;
    } else {//本身没有到达终点,自己沿着下一跳中的第一个继续移动,其余的下一跳每一个分配一个后代
      nextNodes = this.__getUseFulNext().slice(1);//去掉第一个
    }

    nextNodes.forEach((nextNode)=> {
      let childTraveller = new shortestTraveller(this.graph, {
        presentNodeName: this.__presentNodeName,
        destinationNodeName: this.__destinationNodeName,
        fromNodeName:this.__fromNodeName
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
module.exports = shortestTraveller;