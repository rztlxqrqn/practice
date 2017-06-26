const Calculate = require('./calculate');
class shortestTrip extends Calculate{
  constructor(graph,params){
    super('shortest',graph,{
      presentNodeName:params.from,
      destinationNodeName:params.to
    });
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    let compare = function (num1, num2) {
      return num1.distance>num2.distance;
    };
    trips.sort(compare);
    return trips[0].distance;
  }
}
module.exports = shortestTrip;