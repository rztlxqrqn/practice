/*
按照格式输出结果:
主要是拼接字符串
 */

module.exports = function (question, answer) {
  if(answer instanceof Object){
    return console.log(question.str + 'answer is %s', JSON.stringify(answer));

  }
  console.log(question.str + 'answer is %s',answer);

}