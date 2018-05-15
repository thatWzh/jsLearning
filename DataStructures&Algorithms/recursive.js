// var ids = [34112, 98325, 68125];
// (function sendRequest(){
//     var id = ids.shift();
//     if(id){
//         $.ajax({url: "/get", data: {id}}).always(function(){
//             //do sth.
//             console.log("finished");
//             sendRequest();
//         });
//     } else {
//         console.log("finished");
//     }
// })();
// 上面代码定义了一个sendRequest的函数，在请求完成之后再调一下自己。每次调之前先取一个数据，如果数组已经为空，则说明处理完了。这样就用简单的方式实现了串行请求不堵塞的功能。

// 由于DOM是一棵树，而树的定义本身就是用的递归定义，所以用递归的方法处理树，会非常地简单自然。例如用递归实现一个查DOM的功能document.getElementById。

// function getElementById(node, id) {
//     if (!node) return null;
//     if (node.id === id) return node;
//     for (var i = 0; i < node.childNodes.length; i++) {
//         var found = getElementById(node.childNodes[i], id);
//         if (found) return found;
//     }
//     return null;
// }


//非递归方法
function getElementById(node,id) {
    while (node){
        if(node.id===id) return node;
        node=nextElement(node);
    }
    return null;
}
function nextElement(node) {
    if(node.children.length){
        return node.children[0];
    }
    if(node.nextElementSibling){
        return node.nextElementSibling;
    }
    while (node.parentNode){
        if(node.parentNode.nextElementSibling){
            return node.parentNode.nextElementSibling;
        }
        node=node.parentNode;
    }
    return null;
}

console.log(getElementById(document,'app'));



