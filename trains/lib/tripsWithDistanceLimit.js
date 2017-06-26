const Calculate = require('./calculate');
class tripsWithDistanceLimit extends Calculate {
  constructor(graph, distanceLimit) {
    super('distanceLimit', graph, {
      presentNodeName: distanceLimit.from,
      destinationNodeName: distanceLimit.to,
      limitParam: distanceLimit.param,
      limitDistance: distanceLimit.number
    });
  }

  __choose(trips) {
    if (trips.length === 0) {
      return Promise.reject('NO SUCH ROUTE')
    }
    trips = trips.filter((trip)=> {
      return trip.distance != 0;
    })
    return Promise.resolve(trips.length);
  }
}
module.exports = tripsWithDistanceLimit;