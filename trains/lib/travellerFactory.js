const DistanceTraveller = require('./model/distanceTaveller');
const DistanceLimitTraveller = require('./model/distanceLimitTraveller');
const ShortestTraveller = require('./model/shortestTraveller');
const StopsLimitTraveller = require('./model/stopsLimitTraveller');
module.exports = function (travellerType,graph,param) {
  switch(travellerType){
    case 'distance':
      return new DistanceTraveller(graph,param);
    case 'distanceLimit':
      return new DistanceLimitTraveller(graph,param);
    case 'shortest':
      return new ShortestTraveller(graph,param);
    case 'stopsLimit':
      return new StopsLimitTraveller(graph,param);
    default :
      throw new Error('Traveller type Error. Only distance,distanceLimit,shortest and stopsLimit are supported!')
  }
};
