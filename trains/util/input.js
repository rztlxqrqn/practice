/*
 1.读取描述图信息的text文件,转化为数组
 2.读取描述问题的字符串,转化为对象
 3.处理输入文件中的各种错误(凡事有格式错误就退出)
 */
const fs = require('fs');
module.exports = function (fileName) {
  return new Promise((res,rej)=>{
    fs.readFile(fileName, 'utf-8', (err, text)=> {
      if (err) {
        console.error(err);
        return rej(err)
      }
      let edges = text.split(', ');
      let retEdges = edges.map((edge)=> {
        if (edge.length !== 3) {
          throw new Error('输入文件格式错误');
        }
        let distance = Number(edge[2]);
        if (distance instanceof Number) {
          throw new Error('输入文件格式错误');
        }
        return {
          from: edge[0],
          to: edge[1],
          distance: distance
        }
      });
      return res(retEdges);
    })
  })
  
};
