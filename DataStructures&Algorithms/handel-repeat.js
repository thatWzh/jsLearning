//重复值处理

// 给两个数组，需要找出第一个数组里面的重复值和非重复值。找到的重复值是需要保留，找到非重复值是要删掉的。

// 最直观的方法是使用双重循环。

var lastHouses=[1,2,3,4,5,6,7,8,9,0];
function filterHouse(houses) {
    if(lastHouses === null){
        lastHouses = houses;
        return {
            remainsHouses: [],
            newHouses: houses
        };
    }
    var remainsHouses = [],
        newHouses = [];

    for(var i = 0; i < houses.length; i++){
        var isNewHouse = true;
        for(var j = 0; j < lastHouses.length; j++){
            if(houses[i] === lastHouses[j]){
                isNewHouse = false;
                remainsHouses.push(lastHouses[j]);
                break;
            }
        }
        if(isNewHouse){
            newHouses.push(houses[i]);
        }
    }
    lastHouses = remainsHouses.concat(newHouses);
    return {
        remainsHouses: remainsHouses,
        newHouses: newHouses
    };
}

console.log(filterHouse([1,3,34,865,22,5,6,8,0]));