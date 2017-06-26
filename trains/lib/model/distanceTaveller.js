const BaseTraveller = require('./baseTraveller');
const emitter = require('../emitterFactory')();
const logger = require('../logger');
class distanceTaveller extends BaseTraveller {
  constructor(graph, param, ancestor) {
    logger.debug('distanceTaveller.init');
    if (!param || !Array.isArray(param.path) || param.path.length <= 1) {
      throw new Error('Init distanceTaveller Error, param error')
    }
    super(graph, ancestor);
    this.__presentNodeName = param.path[0];
    this.__record.push(this.__presentNodeName);
    this.__destinationNodeName = param.path[param.path.length - 1];
    this.__path = param.path;
  }

  isLost() {
    logger.debug('distanceTraveller.isLost');
    if (this.__record.length === this.__path.length) {
      return false;
    }
    //如果走到某一步,后续节点中没有需要的节点
    if (!Array.isArray(this.__presentNode.directNextNodes)
      || !this.__getNextNode()) {
      return true;
    }
    return false;
  }

  isHome() {
    return this.__record.length === this.__path.length;
  }

  duplicate() {
    return;
  }

  __getNextNode() {
    let result = false;
    this.__nextNodeName = this.__path[this.__record.length];
    this.__presentNode.directNextNodes.forEach((node)=> {
      if (node.name === this.__nextNodeName) {
        this.__distanceToNextNode = node.distance;
        result = true;
      }
    });
    return result;
  }
}
module.exports = distanceTaveller;