/*
 入口文件,读取命令行参数
 */
const logger = require('./lib/logger');
const Graph = require('./lib/graph');

const Distance = require('./lib/distance');
const ShortestTrip = require('./lib/shortestTrip');
const TripsWithDistanceLimit = require('./lib/tripsWithDistanceLimit');
const TripsWithStopsLimit = require('./lib/tripsWithStopsLimit');

const input = require('./util/input');
const output = require('./util/output');
const questionParser = require('./util/questionParser');

let inputFile = process.argv[2];
let question = process.argv[3];
console.log('inputFile is %s', inputFile);
console.log('question is %s',question);

return input(inputFile)
  .then(edges=> {
    let graph = new Graph();
    let promises = edges.map((edge)=> {
      return graph.parseEdge(edge.from, edge.to, edge.distance);
    });
    return Promise.all(promises).then(()=> {
      return graph;
    })
  })
  .then((graph)=> {
    let realQuestion = questionParser(question);
    if(realQuestion.type === 'distance'){
      console.log('distance');
      let excutor = new Distance(graph,realQuestion.path)
      return excutor.getTrips()
        .then((distance)=>{
          output(realQuestion,distance)
        })
        .catch((err)=>{
          output(realQuestion,err)
        })
    }
    if(realQuestion.type === 'stopLimit'){
      console.log('stopLimit');

      let stopLimit = {
        from:realQuestion.from,
        to:realQuestion.end,
        param:realQuestion.param,
        number:realQuestion.number
      };
      
      let excutor = new TripsWithStopsLimit(graph,stopLimit);
      return excutor.getTrips(realQuestion.from,realQuestion.end)
        .then((trips)=>{

          output(realQuestion,trips)
        })
    }
    if(realQuestion.type === 'distanceLimit'){
      console.log('distanceLimit');

      let distanceLimit = {
        param:realQuestion.param,
        number:realQuestion.number,
        from:realQuestion.from,
        to:realQuestion.end
      };

      let excutor = new TripsWithDistanceLimit(graph,distanceLimit);
      return excutor.getTrips(realQuestion.from,realQuestion.end)
        .then((trips)=>{
          output(realQuestion,trips)
        })
    }
    if(realQuestion.type === 'shortest'){
      let excutor = new ShortestTrip(graph,{
        from:realQuestion.from,
        to:realQuestion.end
      });

      return excutor.getTrips(realQuestion.from,realQuestion.end)
        .then((distance)=>{
          output(realQuestion,distance)
        })
        .catch((err)=>{
          output(realQuestion,err)
        })
    }
  })



