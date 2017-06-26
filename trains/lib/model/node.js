class node {
  constructor(name) {
    if (typeof name != 'string') {
      console.error('初始化节点错误,没有传入节点名字');
      throw new Error('初始化节点错误,没有传入节点名字')
    }
    this.name = name;
    this.directNextNodes = [];//一步可达的节点名字和距离,例子{node1:5}
  }

  addDirectNextNode(nodeName, distance) {
    if ((typeof nodeName != 'string') || (typeof distance != 'number')) {
      console.error('向名为' + this.name + '的节点加入一步可达节点失败');
      return Promise.reject(new Error('nextNode attributes Error'));
    }
    if (nodeName === this.name) {
      console.error('不能向节点' + this.name + '添加同名一步可达节点');
      return Promise.reject(new Error('nextNode must not selfNode'));
    }
    //没有这个节点,加入

    if (!this.__isInDirectNextNodes(nodeName)) {
      this.directNextNodes.push({
        name: nodeName,
        distance: distance
      });
      return Promise.resolve();
    }else{
      return Promise.reject(new Error('nextNode is Existed'));
    }
  }

  __isInDirectNextNodes(nodeName) {
    let result = false;
    this.directNextNodes.forEach((nextNode)=> {
      if (nextNode.name === nodeName) {
        result = true;
      }
    });
    return result;
  }

  isEqual(node) {
    return this.name === node.name;
  }
}
module.exports = node;