const Calculate = require('./calculate');
class shortestTrip extends Calculate{
  constructor(graph){
    super(graph);
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    let compare = function (num1, num2) {
      return num1.distance>num2.distance;
    };
    trips.sort(compare);
    return trips[0];
  }
}
module.exports = shortestTrip;