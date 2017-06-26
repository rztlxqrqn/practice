const Calculate = require('./calculate');
class tripsWithStopsLimit extends Calculate{
  constructor(graph,stopLimit){
    super('stopsLimit',graph,{
      presentNodeName:stopLimit.from,
      destinationNodeName:stopLimit.to,
      limitParam:stopLimit.param,
      limitStops:stopLimit.number + 1//TODO 此处需要再研究为什么需要加1
    });
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    trips = trips.filter((trip)=>{
      return trip.distance!= 0;
    })
    return Promise.resolve(trips.length)
  }
}
module.exports = tripsWithStopsLimit;