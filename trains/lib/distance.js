const Calculate = require('./calculate');
class distance extends Calculate{
  constructor(graph,path){
    super('distance',graph,{path:path});
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    return Promise.resolve(trips[0].distance)
  }
}
module.exports = distance;

