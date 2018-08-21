var log = function () {
  console.log.apply(console, arguments);
};

var e = function (selector) {
  return document.querySelector(selector);
};

// 格式化秒数到时间格式
Number.prototype.formatTime = function () {
  // 计算
  var i = 0,
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
    return v >> 0 < 10 ? "0" + v : v;
  };
  return [zero(i), zero(s)].join(":");
};

// 数据对象
var g = {
  songUrl: [],
  song: []
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
};

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
};

// 动画操作
var addAction = function (selector, className1, className2) {
  e(selector).classList.add(className1);
  e(selector).classList.remove(className2);
};

var removeAction = function (selector, className1, className2) {
  e(selector).classList.add(className2);
  e(selector).classList.remove(className1);
};

// 结束时改变图标及重置状态
var stopAction = function () {
  // 改变进度条位置
  e("#id-music-player").currentTime = 0;
  // 改变图标
  removeAction("#play-btn", "icon-zanting", "icon-bofang");
  removeAction("#animate", "animate", "animate-pause");
  // // 改变自定义进度条位置
  e(".rank").style.left = "";
};

// 切歌功能
var toggleSone = function () {
  e("#past").addEventListener("click", function () {
    // 找到节点
    var s = e("source");
    var player = e('#id-music-player')
    
    // 将自定义元素data-作为索引值操作
    var d = ++s.dataset.index;
    // log(d)
    if(s.dataset.index == g.song.length){
      alert('最后一首了')
      // s.dataset.index = 0
      return
    }
    player.src = g.songUrl[d];
    e("#id-music-player").load();
    stopAction();
  });

  e("#last").addEventListener("click", function () {
    var s = e("source");
    var player = e('#id-music-player')
    if(s.dataset.index == 0){
      alert('前面没有了了')
      // s.dataset.index = 0
      return
    }
    
    var d = --s.dataset.index;
    player.src = g.songUrl[d];
    e("#id-music-player").load();
    stopAction();
  });
};
toggleSone();
// 本地添加功能
var addSong = function () {
  var back = e("#back");
  // 返回按钮事件
  back.addEventListener("click", function (event) {

    var condition = e("#insert").style.display
    // log('sss', condition)

    if (condition == 'block') {
      // 菜单显示时 返回播放界面
      e("#insert").style.display = 'none'
    } else if(condition !== 'block'){
      // 显示添加歌曲界面
      e('.full').style.display = 'block'
      // 展示添加的数据 同步数据到g
      // 清空上一次结果
     
      

      // log('bbb')
    }
    
    // 点击back 添加到播放列表
    e('.flex-center a').addEventListener('click', function (event) {
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


    // // 点击将url添加到页面上 
    // e('#id-music-player').src = g.songUrl[0]
    // e('#id-music-player').play()

    // //  返回播放器界面
    // e('.full').addEventListener('click', function () {
    //   // 返回播放器界面
    //   // 将ul中数据添加到 gua.song

    // })



  });
  // !巨坑 不要绑定到按钮点击事件中!!
  e('#customFile').addEventListener('change', function () {
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
}
// 播放功能
var player = function (selector) {
  var gua = e("#id-music-player");
  var btn = e("#play-btn");
  var cDiv = e(".center");
  var menu = e("#menu");

  // 监听播放结束事件
  gua.addEventListener("ended", function () {
    stopAction();
  });
  // 显示播放时间
  gua.addEventListener("durationchange", function () {
    var half = Number(gua.currentTime).formatTime();
    var full = Number(gua.duration).formatTime();

    e(".range .left").innerHTML = half;
    e(".range .right").innerHTML = full;
    // log('durationchange', half, full)
  });
  // 监听时间改变
  gua.addEventListener("timeupdate", function () {
    var index = gua.currentTime / gua.duration;
    e(".rank").style.left = `${index * 150}px`;
    // log('timeupdate')
    // 更新当前歌曲进行时间
    var half = Number(gua.currentTime).formatTime();
    e(".range .left").innerHTML = half;
  });
  // 监听进度条改变
  cDiv.addEventListener("click", function (event) {
    var x = event.offsetX;
    var o = x / 150;
    var aa = (e(".rank").style.left = `${x}px`);
    // 点击定位播放位置
    gua.currentTime = gua.duration * o;
    // var y = event.clientY;10
    // log(x, aa, o)
  });

  // 播放按钮点击事件
  btn.addEventListener("click", function (event) {
    // 切换播放状态及图标类
    var target = event.target;
    toggleClass(target, "icon-bofang", "icon-zanting");
    togglePlay("#play-btn", "icon-zanting", "icon-bofang", "#id-music-player");
  });

  // 点击按钮弹出播放列表
  menu.addEventListener("click", function () {

    e("#insert").style.display = `block`



    // 菜单点击事件 点击li 添加url 播放
    e("#insert ul").addEventListener("click", function (event) {
      var target = event.target;
      // 找到自定义属性作为下标
      var index = target.dataset.song;
      // 获取当前播放链接
      var s = e("#id-music-player");
      // 改变链接
      s.src = g.songUrl[index];
      // 重载
      e("#id-music-player").load();
      stopAction();
      // 改变display值
      e("#insert").style.display = `none`;
    });
  });
  addSong()

};
player();