module.exports = {
  debug:function (string) {
    if(process.env.NODE_ENV==='development'){
      console.log(string);
    }
  },
  info:function (string) {
    console.log(string);
  }
};
