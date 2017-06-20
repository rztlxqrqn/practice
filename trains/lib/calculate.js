const emitter = require('./emitterFactory')();
const Traveller = require('./model/traveller');
const Travellers = require('./travellers');
class calculate{
  constructor(graph){
    this.graph = graph;
  }
  getTrips(origin,end){
    console.log('origin is %s,end is %s', origin, end);

    let traveller = new Traveller(this.graph,this.distanceLimit,this.stopLimit,this.path);

    const travellers = new Travellers(traveller);
    //travellers到达Ready状态后,获取路径
    return new Promise((res)=>{
      emitter.on('Ready',()=>{
        res(travellers.getTrips().then((trips)=>{
          let validTrips = trips.filter((trip)=>{
            return trip.distance!=0;
          })
          return this.__choose(validTrips);
        })) 
      });
      //开始由travellers触发工作
      emitter.emit('Begin',origin,end);
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
