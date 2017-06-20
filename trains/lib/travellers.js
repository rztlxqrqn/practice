const emitter = require('./emitterFactory')();
class travellers {
  constructor(firstTraveller) {

    this.firstTraveller = firstTraveller;
    this.travellers = [firstTraveller];
    this.numberOfFinishedTravellers = 0;
    emitter.on('Begin', (fromNode, toNode)=> {
      console.log('Travellers start work!');

      this.firstTraveller.nextNodeName = fromNode;
      this.firstTraveller.destinationNodeName = toNode;


      emitter.emit('TRAVEL')
    });
    //某个traveller的任务结束了(LOST 或者  HOME)
    emitter.on('MyTravelIsEnd', ()=> {
      console.log('One traveller is end!');
      this.numberOfFinishedTravellers++;
      //如果当前travellers中的所有traveller的任务都结束了,表示计算完成
      if (this.numberOfFinishedTravellers === this.travellers.length) {
        return emitter.emit('Ready')
      }
      emitter.emit('TRAVEL')
    });
    //分裂出了新的traveller
    emitter.on('NewTraveller', (traveller)=> {
      console.log('New traveller add!');
      this.travellers.push(traveller);
    })
  }

  getTrips() {
    console.log('getTrips');

    let trips = [];

    this.travellers.forEach((traveller)=> {

      if (traveller.status === 'HOME') {
        trips.push({
          record: traveller.getRecord(),
          distance: traveller.getDistance()
        })
      }
    })

    return Promise.resolve(trips);
  }
}
module.exports = travellers;



