const expect = require('chai').expect;
const Graph = require('../lib/graph');
describe('generate a graph.first step:generate a empty graph;second step:add edges one by one',()=>{
  describe('empty graph',()=>{
    it('constructor',()=>{
      let graph = new Graph();
      expect(graph instanceof Graph).to.be.true;
      expect(graph.nodes).to.be.empty;
    });
  });
  describe('edge parse',()=>{
    it('one edge',()=>{
      let graph = new Graph();
      return graph.parseEdge('A','B',5)
        .then((gragh)=>{
          expect(graph.nodes.length).to.equal(2);
          expect(graph.nodes[0].name).to.equal('A');
          expect(gragh.nodes[0].directNextNodes.length).to.equal(1);
          expect(gragh.nodes[0].directNextNodes[0].distance).to.equal(5);
          expect(gragh.nodes[1].name).to.equal('B');
        })
    });
    it('three edges',()=>{
      let graph = new Graph();
      return graph.parseEdge('A','B',5)
        .then((graph)=>{
          expect(graph.nodes.length).to.equal(2);
          expect(graph.nodes[0].name).to.equal('A');
          expect(graph.nodes[0].directNextNodes.length).to.equal(1);
          expect(graph.nodes[0].directNextNodes[0].distance).to.equal(5);
          expect(graph.nodes[1].name).to.equal('B');
          return graph
        })
        .then((graph)=>{
          return graph.parseEdge('A','C',4)
            .then((graph)=>{
              expect(graph.nodes.length).to.equal(3);
              expect(graph.nodes[0].name).to.equal('A');
              expect(graph.nodes[1].name).to.equal('B');
              expect(graph.nodes[2].name).to.equal('C');
              expect(graph.nodes[0].directNextNodes.length).to.equal(2);
              expect(graph.nodes[0].directNextNodes[0].distance).to.equal(5);
              expect(graph.nodes[0].directNextNodes[1].distance).to.equal(4);
              return graph;
            })
        })
        .then((graph)=>{
          return graph.parseEdge('C','B',3)
            .then((graph)=>{
              expect(graph.nodes.length).to.equal(3);
              expect(graph.nodes[2].directNextNodes.length).to.equal(1);
              expect(graph.nodes[0].directNextNodes[0].distance).to.equal(5);
              expect(graph.nodes[0].directNextNodes[1].distance).to.equal(4);
              expect(graph.nodes[2].directNextNodes[0].distance).to.equal(3);
              return graph;
            })
        })
    });
    it('out of order add',()=>{
      let graph = new Graph();
      let graph1 = new Graph();
      return Promise.all([
        graph.parseEdge('A','B',7),
        graph.parseEdge('B','D',5),
        graph.parseEdge('D','A',3),
        graph.parseEdge('D','B',2)
      ]).then(()=>{
        return Promise.all([
          graph1.parseEdge('B','D',5),
          graph1.parseEdge('A','B',7),
          graph1.parseEdge('D','A',3),
          graph1.parseEdge('D','B',2)
        ]).then(()=>{
          let str1 = JSON.stringify(graph.nodes.sort((item1,item2)=>{
            return item1.name>item2.name;
          }));
          let str2 = JSON.stringify(graph1.nodes.sort((item1,item2)=>{
            return item1.name>item2.name;
          }));
          expect(str1).to.eql(str2);
        })
      })
    });
    it('repetition error',()=>{
      let graph = new Graph();
      return graph.parseEdge('A','B',5)
        .then((graph)=>{
          return graph.parseEdge('A','B',4);
        })
        .catch((err)=>{
          expect(err.message).to.equal('nextNode is Existed');
        })
    });
  });
  describe('getNode',()=>{
    it('getANode',()=>{
      let graph = new Graph();
      return Promise.all([
        graph.parseEdge('A','B',7),
        graph.parseEdge('B','D',5),
        graph.parseEdge('D','A',3),
        graph.parseEdge('D','B',2)
      ]).then(()=>{
        return graph.getNode('A')
          .then((node)=>{
            expect(node.name).to.equal('A');
            expect(node.directNextNodes).to.eql([{
              name:'B',
              distance:7
            }])
          })
      })
    });
  });
});
