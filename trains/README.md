我完成的题目是Problem one: Trains
根路径下有questions.txt文件,其中包括了测试数据中的7个问题,可以直接粘贴到终端执行
输出格式为 "问题描述"+"answer"+"输出"的形式展示,计算过程大约耗时5s(异步计算,人为设置的等待时间)
运行环境node.js版本6.10及以上
如果执行测试,请先执行npm install
测试命令 npm run test
覆盖率测试命令 npm run cover
目前测试覆盖率较低,原因待查
以下是代码目录结构
```
├── README.md
├── index.js                                    //入口文件
├── input.txt                                   //问题中,关于边的描述文件
├── lib                                         //代码主目录
│   ├── calculate.js                            
│   ├── distance.js
│   ├── emitterFactory.js
│   ├── graph.js
│   ├── logger.js
│   ├── model
│   │   ├── baseTraveller.js
│   │   ├── distanceLimitTraveller.js
│   │   ├── distanceTaveller.js
│   │   ├── node.js
│   │   ├── shortestTraveller.js
│   │   └── stopsLimitTraveller.js
│   ├── shortestTrip.js
│   ├── travellerFactory.js
│   ├── travellersManager.js
│   ├── tripsWithDistanceLimit.js
│   └── tripsWithStopsLimit.js
├── package.json
├── questions.txt                               //问题描述文件,目前需要按照其中的格式写问题,程序才能识别
|                                               //其中包含了测试数据中的10个问题,可以直接黏贴命令行执行
|                                               //答案以"问题描述"+"answer"+"输出"的形式展示,计算过程大约耗时5s
|                                               //请耐心等待
├── test                                        //测试代码所在路径
│   ├── graghTest.js
│   ├── model
│   │   ├── distanceLimitTravellerTest.js
│   │   ├── distanceTravellerTest.js
│   │   ├── nodeTest.js
│   │   ├── shortestTravellerTest.js
│   │   └── stopsLimitTravellerTest.js
│   └── travellersManagerTest.js
└── util                                        //输入和输出辅助代码
    ├── input.js
    ├── output.js
    └── questionParser.js
```
