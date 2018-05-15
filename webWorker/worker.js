console.log('WORKER TASK: ','running');

//监听事件
onmessage=function (e) {
    console.log('WORKER TASK: ','RECEIVE',e.data.m);

    //发送数据事件
    // 注意：这里的 hhh 变量在 worker.js 中并未定义，所以这里执行过程中会错处
    // postMessage(hhh);
    postMessage('Hello, I am Worker');
}

// 或者使用 addEventListener 来监听事件
//addEventListener('message', function (e) {
//  console.log('WORKER TASK: ', 'RECEIVE', e.data);
//  ...
//});

//加载外部脚本
importScripts('worker1.js','worker2.js');