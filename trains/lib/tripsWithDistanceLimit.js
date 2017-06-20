const Calculate = require('./calculate');
class tripsWithDistanceLimit extends Calculate{
  constructor(graph,distanceLimit){
    super(graph);
    this.distanceLimit = distanceLimit;
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    return Promise.resolve(trips);
  }
}
module.exports = tripsWithDistanceLimit;