const emitter = require('../emitterFactory')();
class traveller {
  constructor(graph, distanceLimit, stopLimit,path) {
    if (typeof graph.getNode !== 'function') {
      console.error('初始化traveller错误,传入的图描述错误');
      throw new Error('traveller init error')
    }
    this.graph = graph;
    this.distanceLimit = distanceLimit;
    this.stopLimit = stopLimit;

    this.record = [];
    this.status = 'TRAVELING';
    this.presentNodeName = undefined;
    this.nextNodeName = undefined;
    this.destinationNodeName = undefined;
    this.distance = 0;
    
    this.path = path||[];//用于处理规定了path的情况
    
    this.getRecord = function () {
      return this.record;
    };
    
    this.getDistance = function () {
      return this.distance
    };
    this.isLock=false;
    emitter.on('TRAVEL', ()=> {
      //判断状态
      if (this.status !== 'TRAVELING') {
        return;
      }
      //判断锁状态
      if(this.isLock){
        return;
      }
      //加锁
      this.lock();
      this.leave()
        .then(this.arrive())
    });

    
    

  }
  //如果规定了path,则不在考虑分裂,只返回path的distance
  hasPath(){
    return this.path.length!=0
  }
  getNextNodeNameInPath(){
    return this.path[this.path.indexOf(this.presentNodeName)+1]
  }
  //用于这个对象在接受某个event后,处理过程中不再接受event
  lock(){
    this.isLock = true;
  }
  unlock(){
    this.isLock = false
  }
  //已经经过的节点可以再次经过,限制路径总长度小于100
  getAvailableNextNodeNames(node) {
    if(this.hasPath()||this.stopLimit||this.distanceLimit){
      return Object.keys(node.directNextNodes);
    }
    return Object.keys(node.directNextNodes).filter((nextNodeName)=> {
      return this.record.every((nodeName)=> {
        return nextNodeName != nodeName || nextNodeName===this.record[0];//不在record中,或者是record的启示节点
      })
    })
  }

  goHome() {
    this.status = 'HOME';
    emitter.emit('MyTravelIsEnd');

  }

  lost() {//设置自身状态为LOST
    console.log('lost');

    console.log(this);

    this.status = 'LOST';
    emitter.emit('MyTravelIsEnd');

  }

  isHome(presentNode, destinationNode) {
    if(this.record.length<2){
      return false;
    }
    return presentNode.isEqual(destinationNode);
  }

  isLost(presentNode, destinationNode) {
    //如果有path限制,需要判断下一跳在不在当前节点的下一跳范围内
    if(this.hasPath()){

      if(presentNode.isEqual(destinationNode)){
        return false
      }
      return presentNode.directNextNodes[this.getNextNodeNameInPath()]===undefined;
    }

    //如果有距离限制
    if (this.distanceLimit) {
      if (this.distanceLimit.param = 'lessThan' && this.distanceLimit.number <= this.distance) {
        return true;
      }
    }
    if (presentNode.isEqual(destinationNode)) {
      //虽然到达了终点,但是经过的node数量与要求的不同,也算没到
      if (this.stopLimit && this.stopLimit.param === 'exactly' && this.record.length != this.stopLimit.number) {
        return true
      }
      return false
    }
    //失败的结束条件
    //1.当前节点没有下一跳,且不是目的节点
    //2.跳数判断
    if (Object.keys(presentNode.directNextNodes).length === 0) {
      return true;
    }
    //筛选出下一跳中可用node的name
    let availableNextNodeNames = this.getAvailableNextNodeNames(presentNode);

    if (availableNextNodeNames.length === 0) {
      return true;
    }
    if (this.stopLimit) {
      //有跳数限制,且已经达到限制,不可能超过限制
      if ((this.stopLimit.param === 'maximum' || this.stopLimit.param === 'exactly') && this.record.length > this.stopLimit.number+1) {
        return true;
      }
      
    }
    return false
  }

  arrive() {
    this.presentNodeName = this.nextNodeName;//改变当前所在节点名称
    this.record.push(this.presentNodeName);//将当前节点加入路径记录
    return this.graph.getNode(this.presentNodeName)
      .then((presentNode)=> {
        return this.graph.getNode(this.destinationNodeName)
          .then((destinationNode)=> {
            if (this.isLost(presentNode, destinationNode)) {//判断是否迷失了
              return this.lost();
            }

            if(this.hasPath()){
              if(this.isHome(presentNode, destinationNode)){
                this.goHome();
              }else{
                this.nextNodeName = this.getNextNodeNameInPath();
                this.unlock();
                emitter.emit('TRAVEL')
              }
              
            }else{
              let availableNextNodeNames = this.getAvailableNextNodeNames(presentNode);//当前节点有可用的下一跳
              if(!this.isHome(presentNode, destinationNode)){
                //针对每个下一跳,分裂出traveller
                this.nextNodeName = availableNextNodeNames[0];//设置当前traverller继续前进
                console.log(availableNextNodeNames);
                availableNextNodeNames.shift();//去掉第一个元素(已经处理过了)
                //如果此时数组已经是空数组,就由这个traveller继续
                console.log(this);



                availableNextNodeNames.forEach((nodeName)=> {
                  let newTraveller = this.duplicate(nodeName);
                  console.log(newTraveller);

                  emitter.emit('NewTraveller', newTraveller);//把新的traveller加入travellers,并通知travellers
                });
                //解锁
                this.unlock();
                emitter.emit('TRAVEL')
              }else{
                availableNextNodeNames.forEach((nodeName)=> {
                  let newTraveller = this.duplicate(nodeName);
                  emitter.emit('NewTraveller', newTraveller);//把新的traveller加入travellers,并通知travellers
                });
                //解锁
                this.goHome();
                emitter.emit('TRAVEL')
              }
              
            }
            
          })
      })

  }

  duplicate(nodeName) {
    let newTraveller = new traveller(this.graph, this.distanceLimit, this.stopLimit);
    newTraveller.record = [];
    this.record.forEach((str)=>{//此处不能直接复制,其它属性都是字符串,这个是数组,直接复制会指向同一个对象
      newTraveller.record.push(str);
    });
    newTraveller.status = 'TRAVELING';
    newTraveller.presentNodeName = this.presentNodeName;
    newTraveller.destinationNodeName = this.destinationNodeName;
    newTraveller.nextNodeName = nodeName;//设置下一跳
    newTraveller.distance = this.distance;
    return newTraveller;
  }

  leave() {

    if (this.presentNodeName === undefined) {
      return Promise.resolve();
    }
    return this.graph.getNode(this.presentNodeName)
      .then((presentNode)=> {
        return this.distance = this.distance + presentNode.directNextNodes[this.nextNodeName];//经过的距离增加
      })
  }
}
module.exports = traveller;
