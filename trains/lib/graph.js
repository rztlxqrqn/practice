const Node = require('./model/node');
const logger = require('./logger');
class graph{
  constructor(){
    logger.debug('graph init')
    this.nodes = [];
  }
  parseEdge(fromNodeName,toNodeName,distance){
    logger.debug('graph.parseEdge');
    return this.isNodeExisted(fromNodeName)
      .then((fromNode)=>{
        return this.isNodeExisted(toNodeName)
          .then((toNode)=>{
            return fromNode.addDirectNextNode(toNode.name,distance)
              .then(()=>{
                return this;
              })
          })
      })
  }
  isNodeExisted(nodeName){
    logger.debug('graph.isNodeExisted');
    let exist = this.nodes.find((node)=>{
      return node.name === nodeName;
    });
    if(exist){
      return Promise.resolve(exist);
    }
    let newNode = new Node(nodeName);
    this.nodes.push(newNode);
    return Promise.resolve(newNode);
  }
  getNode(nodeName){
    logger.debug('graph.getNode');
    let node = this.nodes.find((node)=>{
      return node.name === nodeName;
    })
    return Promise.resolve(node);
  }
}
module.exports = graph;