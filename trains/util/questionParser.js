/*
 The distance of the route A-B-C.
 The distance of the route A-D.
 The distance of the route A-D-C.
 The distance of the route A-E-B-C-D.
 The distance of the route A-E-D.
 The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).
 The number of trips starting at A and ending at C with exactly 4 stops.  In the sample data below, there are three such trips: A to C (via B,C,D); A to C (via D,C,D); and A to C (via D,E,B).
 The length of the shortest route (in terms of distance to travel) from A to C.
 The length of the shortest route (in terms of distance to travel) from B to B.
 The number of different routes from C to C with a distance of less than 30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC, CEBCEBC, CEBCEBCEBC.
 */
function distanceParser(str){
  let arr = str.split(' ');
  let end = arr[arr.length-1];
  let subStr = end.substring(0,end.length-1);
  let retArray = subStr.split('-');
  return {
    str:str,
    type:'distance',
    path:retArray
  }
}
// console.log(distanceParser('The distance of the route A-E-B-C-D.'));
function stopLimitParser(str) {
  let arr = str.split(' ');
  let from = arr[6];
  let end = arr[10];
  let number = Number(arr[arr.indexOf('stops.')-1]);
  let param = str.includes('exactly')?'exactly':'maximum';
  return {
    str:str,
    type:'stopLimit',
    from:from,
    end:end,
    param:param,
    number:number
  }
}
let str = 'The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).'
// console.log(stopLimitParser(str));

function distanceLimit(str) {
  let arr = str.split(' ');
  let param = 'lessThan';
  let from = arr[6];
  let to = arr[8];
  let number = Number(arr[arr.indexOf('than')+1].substring(-1));
  return {
    str:str,
    type:'distanceLimit',
    from: from,
    end:to,
    param:param,
    number:number
  }
}
let str3 = 'The number of different routes from C to C with a distance of less than 30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC, CEBCEBC, CEBCEBCEBC.'
// console.log(distanceLimit(str3));

function shortest(str) {
  let strS = str.substring(0,str.length-1)
  let arr = strS.split(' ');
  let from = arr[arr.indexOf('from')+1];

  let to = arr[arr.length-1];
  return {
    str:str,
    type:'shortest',
    from:from,
    end:to
  }
}
let str4 = 'The length of the shortest route (in terms of distance to travel) from A to C.';
// console.log(shortest(str4));
module.exports = function (question) {
  if(question.includes('The distance')){
    return distanceParser(question);
  }
  if(question.includes('stops')){
    return stopLimitParser(question)
  }
  if(question.includes('less than')){
    return distanceLimit(question)
  }
  if(question.includes('shortest')){
    return shortest(question)
  }
}