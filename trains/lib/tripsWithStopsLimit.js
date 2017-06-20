const Calculate = require('./calculate');
class tripsWithStopsLimit extends Calculate{
  constructor(graph,stopLimit){
    super(graph);
    this.stopLimit = stopLimit;
  }
  __choose(trips){
    console.log(trips);

    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    return Promise.resolve(trips)
  }
}
module.exports = tripsWithStopsLimit;