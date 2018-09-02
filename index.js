var log = function () {
  console.log.apply(console, arguments)
}

var e = function (selector) {
  return document.querySelector(selector)
}

// 格式化秒数到时间格式
Number.prototype.formatTime = function () {
  // 计算
  var i = 0,
    s = parseInt(this)
  if (s > 60) {
    i = parseInt(s / 60)
    s = parseInt(s % 60)
    if (i > 60) {
      i = parseInt(i % 60)
    }
  }
  // 补零
  var zero = function (v) {
    return v >> 0 < 10 ? "0" + v : v
  };
  return [zero(i), zero(s)].join(":")
}

// 数据对象
var g = {
  songUrl: [],
  song: []
}

// 字符串切割函数
var cut = function (str, char, number) {
  var s = str.split(char)
  return s[number]
  }

// 播放结束删除操作
var removeAction = function (selector, className1, className2) {
  e(selector).classList.add(className2);
  e(selector).classList.remove(className1);
}

// 结束时改变图标及重置状态
var stopAction = function () {

  // 改变进度条位置
  e("#id-music-player").currentTime = 0
  // 改变图标

  removeAction("#play-btn", "icon-zanting", "icon-bofang")
  removeAction("#animate", "animate", "animate-pause")
  // // 改变自定义进度条位置
  e(".rank").style.left = ""
}

// 绑定事件
var bindEvent = function (selector, eventName, callback) {
  var element = e(selector)
  element.addEventListener(eventName, callback)
}

// 动画操作
var toggleAction = function (selector, className1, className2) {
  var element = e(selector)
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

// 切换类（图标）
var toggleClass = function (selector, className1, className2) {
  var element = e(selector)
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

// 点击播放按钮 切换icon 切换播放 添加动画
var togglePlay = function () {
  var b = e('#id-music-player')
  // togglePlay
  if (b.paused == true) {
    // toggleIcon
    toggleClass('#play-btn', "icon-bofang", "icon-zanting")
    // toggleAnimate
    toggleAction("#animate", "animate", "animate-pause")
    b.play()
    log('开始播放')
  } else if (b.paused == false) {
    toggleClass('#play-btn', "icon-zanting", "icon-bofang")
    toggleAction("#animate", "animate-pause", "animate")
    b.pause()
    log('暂停播放')
  }
}

// 初始化函数
var load = function () {
  var gua = e('#id-music-player')
  // 播放按钮事件
  bindEvent('#play-btn', 'click', function () {
    togglePlay()
  })
  // 播放菜单点击弹出播放列表 
  bindEvent('#menu', 'click', function () {
    e("#insert").style.display = `block`
  })
  // 返回按钮及本地歌曲添加按钮
  bindEvent('#back', 'click', function () {
    var condition = e("#insert").style.display

    if (condition == 'block') {
      // 菜单显示时 返回播放界面
      e("#insert").style.display = 'none'
    } else if (condition !== 'block') {
      // 显示添加歌曲界面
      e('.full').style.display = 'block'
      // 展示添加的数据 同步数据到g
      // 清空上一次结果
    }
  })
  // 表单上传
  bindEvent('#customFile', 'change', function () {
    // 将添加的数据展示到ul里 
    var file = e("#customFile").files[0];
    var li = `<li>${file.name}</li>`
    log(file, li)
    e('.flex-center ul').innerHTML += li
    // 给上传的歌曲添加url 
    var srcData = window.URL.createObjectURL(file)
    // 将歌曲链接和歌曲名称添加到g.songUrl g.song 先清空在添加

    g.songUrl.push(srcData)
    g.song.push(file['name'])
    log(g)
  })
  // 表单返回
  bindEvent('.flex-center a', 'click', function () {
    // 隐藏添加界面 
    e('.full').style.display = 'none'
    // 添加到播放列表中
    // 先清空列表
    // 将g.song放入播放列表中 
    e("#insert ul").innerHTML = ''
    for (let i = 0; i < g.song.length; i++) {
      const element = g.song[i];
      var data = `<li data-song=${i}>${element}</li>`;
      e("#insert ul").insertAdjacentHTML("beforeend", `${data}`);
    }
  })
  // 播放列表点击动态添加歌曲链接
  bindEvent('#insert ul', 'click', function () {
    var target = event.target
    // 找到自定义属性作为下标
    var index = target.dataset.song
    // 获取当前播放链接
    // 改变链接
    gua.src = g.songUrl[index]
    // 添加歌曲名
    var s = g.song[index]
    var str = cut(s, '.', 0)
    // 找到标题元素 重写值
    // log('切割后的字符串', str)
    e('.top b').innerHTML = str
    // 重载
    gua.load();
    stopAction();
    // 改变display值
    e("#insert").style.display = `none`;
  })
  // 监听播放结束事件
  bindEvent('#id-music-player', 'ended', function () {
    stopAction();
  })
  // 显示播放时间
  bindEvent('#id-music-player', 'durationchange', function () {
    var half = Number(gua.currentTime).formatTime()
    var full = Number(gua.duration).formatTime()
    e(".range .left").innerHTML = half
    e(".range .right").innerHTML = full
  })
  // 监听时间改变
  bindEvent('#id-music-player', 'timeupdate', function () {
    var index = gua.currentTime / gua.duration;
    e(".rank").style.left = `${index * 150}px`;
    // log('timeupdate')
    // 更新当前歌曲进行时间
    var half = Number(gua.currentTime).formatTime();
    e(".range .left").innerHTML = half;
  })
  // 进度条事件
  bindEvent('.center', 'click', function () {
    var x = event.offsetX;
    var o = x / 150;
    // 点击定位播放位置
    gua.currentTime = gua.duration * o;
  })
  // 下一首切换
  bindEvent('#past', 'click', function () {
    // 找到节点
    var s = e("source");
    // 将自定义元素data-作为索引值操作
    var d = ++s.dataset.index;
    // log(d)
    if (s.dataset.index == g.song.length) {
      alert('最后一首了')
      // s.dataset.index = 0
      return
    }
    gua.src = g.songUrl[d];
    gua.load();
    stopAction();
  })
  // 上一首切换
  bindEvent('#last', 'click', function () {
    var s = e("source");
  
    if (s.dataset.index == 0) {
      alert('前面没有了了')
      // s.dataset.index = 0
      return
    }

    var d = --s.dataset.index;
    gua.src = g.songUrl[d];
    gua.load();
    stopAction();
  })
}

var main = function () {
  load()
}
main()