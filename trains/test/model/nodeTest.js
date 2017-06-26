const Node = require('../../lib/model/node');
const expect = require('chai').expect;
describe('节点对象测试', ()=> {
  describe('新的节点对象', ()=> {
    it('创建成功', ()=> {
      let aNode = new Node('testa');
      let bNode = new Node('testb');
      expect(aNode.name).to.equal('testa');
      expect(bNode.name).to.equal('testb')
    });
    it('创建失败', ()=> {
      try {
        let cNode = new Node();
      } catch (err) {
        expect(err.message).to.equal('初始化节点错误,没有传入节点名字')
      }
    });
  });
  describe('加入直达节点', ()=> {
    it('加入', ()=> {
      let aNode = new Node('A');
      aNode.addDirectNextNode('B', 5);
      aNode.addDirectNextNode('C', 5);
      expect(aNode.directNextNodes).to.eql([{
        name: 'B',
        distance: 5
      }, {
        name: 'C',
        distance: 5
      }])
    });
    it('加入失败,和当前节点重名', ()=> {
      let aNode = new Node('A');
      return aNode.addDirectNextNode('A', 5).catch((err)=> {
        expect(err).to.exist;
      })
    });
    it('加入失败,第二次加入同名节点', ()=> {
      let aNode = new Node('A');
      return aNode.addDirectNextNode('B', 5).then(()=> {
        return aNode.addDirectNextNode('B', 5)
          .catch((err)=> {
            expect(err).to.exist;
            expect(aNode.directNextNodes).to.eql([{
              name:'B',
              distance:5
            }])
          });
      })
    });
  });
});
