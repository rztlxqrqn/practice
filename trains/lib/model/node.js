class node {
  constructor(name) {
    if (typeof name != 'string') {
      console.error('初始化节点错误,没有传入节点名字');
      throw new Error('初始化节点错误,没有传入节点名字')
    }
    this.name = name;
    this.directNextNodes = {};//一步可达的节点名字和距离,例子{node1:5}
  }

  addDirectNextNode(node, distance, isUpdate) {
    let nodeName = node.name;
    if (!(node instanceof Object) || (typeof nodeName != 'string') || (typeof distance != 'number')) {
      console.error('向名为' + this.name + '的节点加入一步可达节点失败');
      return Promise.reject(new Error('nextNode attributes Error'));
    }
    if (nodeName === this.name) {
      console.error('不能向节点' + this.name + '添加同名一步可达节点');
      return Promise.reject(new Error('nextNode must not selfNode'));
    }
    //没有这个节点,加入
    if (this.directNextNodes[nodeName] === undefined) {
      this.directNextNodes[nodeName] = distance;
      return Promise.resolve();
    }
    //这个节点已经存在,但是要求更新距离
    if (!isUpdate) {
      console.error('向名为' + this.name + '的节点加入一步可达节点' + nodeName + '失败,到这个节点的路径已存在');
      return Promise.reject(new Error('nextNode duplicate'));
    }
    this.directNextNodes[nodeName] = distance;
    return Promise.resolve();
  }

  isEqual(node) {
    return this.name === node.name;
  }
}
module.exports = node;