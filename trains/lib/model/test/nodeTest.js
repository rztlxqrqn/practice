const Node = require('../node');
const expect = require('chai').expect;
describe('节点对象测试',()=>{
  describe('新的节点对象',()=>{
    it('创建成功',()=>{
      let aNode = new Node('testa');
      let bNode = new Node('testb');
      expect(aNode.name).to.equal('testa');
      expect(bNode.name).to.equal('testb')
    });
    it('创建失败',()=>{
      try {
        let cNode = new Node();
      }catch(err) {
        expect(err.message).to.equal('初始化节点错误,没有传入节点名字')
      }
    });
  });
  describe('加入直达节点',()=>{
    it('加入',()=>{
      let aNode = new Node('A');
      let bNode = new Node('B');
      let cNode = new Node('C');
      expect(aNode.addDirectNextNode(bNode,5)).to.be.true;
      expect(aNode.addDirectNextNode(cNode,5)).to.be.true;
      expect(aNode.directNextNodes).to.eql({
        B:5,
        C:5
      })
    });
    it('加入失败,和当前节点重名',()=>{
      let aNode = new Node('A');
      let bNode = new Node('A');
      expect(aNode.addDirectNextNode(bNode,5)).to.be.false;
    });
    it('加入失败,第二次加入同名节点',()=>{
      let aNode = new Node('A');
      let b1Node = new Node('B');
      let b2Node = new Node('B');
      expect(aNode.addDirectNextNode(b1Node,5)).to.be.true;
      expect(aNode.addDirectNextNode(b2Node,4)).to.be.false;
      expect(aNode.directNextNodes).to.eql({
        B:5
      })
    });
    it('更新距离',()=>{
      let aNode = new Node('A');
      let b1Node = new Node('B');
      let b2Node = new Node('B');
      expect(aNode.addDirectNextNode(b1Node,5)).to.be.true;
      expect(aNode.addDirectNextNode(b2Node,4,true)).to.be.true;
      expect(aNode.directNextNodes).to.eql({
        B:4
      })
    });
    it('参数检查',()=>{
      let aNode = new Node('A');
      let b1Node = new Node('B');
      expect(aNode.addDirectNextNode(b1Node)).to.be.false;
      expect(aNode.addDirectNextNode('fsddf',4)).to.be.false;
      expect(aNode.addDirectNextNode({name:{}},4)).to.be.false;
    })
  });
});
