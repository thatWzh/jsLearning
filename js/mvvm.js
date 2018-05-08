// 创建MVVM构造函数
function Mvvm(options = {}) {
    // 类似Vue，将所有属性挂载到$options
    this.$options = options;
    // this._data也和Vue一样
    let data = this._data = this.$options.data;


    // 数据劫持
    observe(data);


    //数据代理
    //this代理了this._data
    for (let key in data) {
        Object.defineProperty(this, key, {
            configurable: true,
            get() {
                return this._data[key];
            },
            set(newVal) {
                this._data[key] = newVal;
            }
        })
    }

    //数据编译
    new Compile(options.el, this);
}

// 创建Observe构造函数
function Observe(data) {
    for (let key in data) {
        let val = data[key];
        observe(val);//递归继续向下找，实现深度的数据劫持
        Object.defineProperty(data, key, {
            configurable: true,
            get() {
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                observe(newVal);
            }
        })
    }
}

//外面写一个函数，不用每次都new，方便递归调用
function observe(data) {
    //如果data不是对象就直接return，防止递归溢出
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}

//数据编译Compile构造函数
function Compile(el, vm) {
    // 将el挂载到实例上方便调用
    vm.$el = document.querySelector(el);
    // 在el范围里将内容都拿到，当然不能一个一个的拿
    // 可以选择移到内存中去然后放入文档碎片中，节省开销
    let fragment = document.createDocumentFragment();
    let child;

    while (child = vm.$el.firstChild) {
        fragment.appendChild(child);//此时将el中的内容放入内存中
    }

    //对el里面的内容进行替换
    // function replace(frag) {
    //     Array.from(frag.childNodes).forEach(node => {
    //         let txt = node.textContent;
    //         const reg = /\{\{\s*([^}]+\S)\s*\}\}/g;
    //
    //         if (node.nodeType === 3 && reg.test(txt)) {//既是文本节点又有双大括号
    //             let arr = RegExp.$1.split('.');
    //             let val = vm;
    //             arr.forEach(key => {
    //                 val = val[key];
    //             })
    //             node.textContent = txt.replace(reg, val).trim();
    //         }
    //         // 如果还有子节点，继续递归replace
    //         if (node.childNodes && node.childNodes.length) {
    //             replace(node)
    //         }
    //     })
    // }
    function replace(frag) {
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            const reg = /\{\{\s*([^}]*\S)\s*\}\}/g;   // 正则匹配{{}}

            if (node.nodeType === 3 && reg.test(txt)) { // 即是文本节点又有大括号的情况{{}}
                function replaceTxt() {
                    node.textContent = txt.replace(reg, (matched, placeholder) => {
                        console.log(placeholder);   // 匹配到的分组 如：song, album.name, singer...
                        // vm.initMounted || new Watcher(vm, placeholder, replaceTxt);   // 监听变化，进行匹配替换内容
                        return placeholder.split('.').reduce((val, key) => {
                            return val[key];
                        }, vm);
                    });
                };
                // 替换
                replaceTxt();
            }
            if (node.nodeType === 1) {  // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name;   // v-model  type
                    let exp = attr.value;   // c        text
                    if (name.includes('v-')) {
                        node.value = vm[exp];   // this.c 为 2
                    }
                    // 监听变化
                    new Watcher(vm, exp, function (newVal) {
                        node.value = newVal;   // 当watcher触发时会自动将内容放进输入框中
                    });

                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给this.c赋了一个新值
                        // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
                        vm[exp] = newVal;
                    });
                });
            }
            // 如果还有子节点，继续递归replace
            if (node.childNodes && node.childNodes.length) {
                replace(node);
            }
        });
    }

    replace(fragment);

    vm.$el.appendChild(fragment);
}

