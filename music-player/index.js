var log = function () {
    console.log.apply(console, arguments);
};

var e = function (selector) {
    return document.querySelector(selector);
};

// 格式化秒数到时间格式
Number.prototype.formatTime = function () {
    // 计算
    var
        i = 0,
        s = parseInt(this);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i > 60) {

            i = parseInt(i % 60);
        }
    }
    // 补零
    var zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(i), zero(s)].join(":");
};

// 数据对象
var g = {
    songUrl: ["kll.mp3", "Ramzi - Fall In Love.mp3"]
};

// 切换播放
var togglePlay = function (selector, className1, className2, element) {

    var btn = e(selector);
    if (btn.classList.contains(className1)) {
        //播放
        e(element).play();
        //添加animate
        addAction("#animate", "animate", "animate-pause");
    } else if (btn.classList.contains(className2)) {
        // 暂停
        e(element).pause();
        //删除animate
        removeAction("#animate", "animate", "animate-pause");
    }
}

// 切换类（图标）
var toggleClass = function (element, className1, className2) {
    // 检查元素是否拥有某个 classs
    if (element.classList.contains(className1)) {
        // 拥有则删除之
        element.classList.remove(className1);
        element.classList.add(className2);
    } else {
        // 没有则加上
        element.classList.add(className1);
        element.classList.remove(className2);
    }
}

// 动画操作
var addAction = function (selector, className1, className2) {
    e(selector).classList.add(className1);
    e(selector).classList.remove(className2);
}

// 动画结束操作
var removeAction = function (selector, className1, className2) {
    e(selector).classList.add(className2);
    e(selector).classList.remove(className1);
}

// 结束时改变图标及重置状态
var stopAction = function () {
    // 改变进度条位置
    e("#id-music-player").currentTime = 0;
    // 改变图标
    removeAction("#play-btn", "icon-zanting", "icon-bofang");
    removeAction("#animate", "animate", "animate-pause");
    // // 改变自定义进度条位置
    e('.rank').style.left = ''
}

// 切歌功能
var toggleSone = function () {

    e("#past").addEventListener("click", function () {
        // 找到节点
        var s = e("source")
        // 将自定义元素data-作为索引值操作
        var d = ++s.dataset.index
        s.src = g.songUrl[d]
        e("#id-music-player").load()
        stopAction()
    })

    e("#last").addEventListener("click", function () {
        var s = e("source")
        var d = --s.dataset.index
        s.src = g.songUrl[d]
        e("#id-music-player").load()
        stopAction()
    })
}
toggleSone()


// 播放功能
var player = function (selector) {

    var gua = e("#id-music-player")
    var btn = e("#play-btn")
    var cDiv = e('.center')
    // 监听播放结束事件
    gua.addEventListener("ended", function () {
        stopAction()
    });

    gua.addEventListener("durationchange", function () {
        var half = Number(gua.currentTime).formatTime()
        var full = Number(gua.duration).formatTime()

        e('.range .left').innerHTML = half
        e('.range .right').innerHTML = full
        log('durationchange', half, full)
    });

    gua.addEventListener("timeupdate", function () {

        var index = gua.currentTime / gua.duration
        e('.rank').style.left = `${index*150}px`
        log('timeupdate')
        // 更新当前歌曲进行时间
        var half = Number(gua.currentTime).formatTime()
        e('.range .left').innerHTML = half

    });

    cDiv.addEventListener('click', function (event) {

        var x = event.offsetX;
        var o = x / 150
        var aa = e('.rank').style.left = `${x}px`
        // 点击定位播放位置
        gua.currentTime = gua.duration * o
        // var y = event.clientY;10
        log(x, aa, o)
    })

    // 播放按钮点击事件
    btn.addEventListener("click", function (event) {
        // 切换播放状态及图标类
        var target = event.target;
        toggleClass(target, "icon-bofang", "icon-zanting")
        togglePlay("#play-btn", "icon-zanting", "icon-bofang", "#id-music-player")

        // 动态监听播放时间
        // 当播放按钮包含.icon-bofang时 停止计时
        var b = btn.classList.contains('icon-zanting')

        // 展示到页面上 #range

    });
};
player();
