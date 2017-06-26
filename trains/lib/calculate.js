const TravellersManager = require('./travellersManager');
class calculate{
  constructor(type,graph,param){
    this.type = type;
    this.graph = graph;
    this.param = param;
  }
  getTrips(origin,end){
    console.log('origin is %s,end is %s', origin, end);

    return new Promise((res,rej)=>{
      let tm = new TravellersManager();
      tm.begin(this.type,this.graph,this.param);
      setTimeout(()=>{
        let result = tm.getTrips();
        res(this.__choose(result));
      },5000)
    })
    
  }
  __choose(trips){
    if(trips.length===0){
      return Promise.reject('NO SUCH ROUTE')
    }
    return Promise.resolve(trips);
  }
}
module.exports = calculate;
