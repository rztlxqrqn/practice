const Node = require('./model/node');
class graph{
  constructor(isUpdate){
    this.nodes = [];
    this.isUpdate = isUpdate || false;
  }
  parseEdge(from,to,distance){
    let self = this;
    return this.isNodeExisted(from)
      .then((fromNode)=>{
        return this.isNodeExisted(to)
          .then((toNode)=>{
            return fromNode.addDirectNextNode(toNode,distance,self.isUpdate)
              .then((res)=>{
                return this;
              })
          })
      })
  }
  isNodeExisted(nodeName){
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
    let node = this.nodes.find((node)=>{
      return node.name === nodeName;
    })
    return Promise.resolve(node);
  }
}
module.exports = graph;