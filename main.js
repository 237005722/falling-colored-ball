// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 定义关于 Ball 的常量
let ballConfig = {
  maxLen: 3, // 球的个数
  minSize: 25, // 球的最小半径
  maxSize: 35, // 球的最大半径
  minVel: 1, // 球的最小速度
  maxVel: 2, // 球的最大速度
  bgColor: 'rgba(0, 0, 0)', //背景颜色
  transColor: 'rgba(0, 0, 0, 0.35)', //球的运动过渡背景颜色，透明度越高，球的运动轨迹越明显
};

// 生成随机数的函数
function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数
function randomColor() {
  // 定义关于 颜色 衍生的属性，5种颜色，随机获取
  const colorConfig = [ // 可自行扩展
    {
      color: 'white',
      click: 1, // 需要点击的次数
      clicked: 0, // 已点击的次数，满足click次数后会重置
      score: -1, // 点击一次的得分
      life: -1, // 点击一次得的生命值
      border: 0, // 触到下边界得的生命值
    },
    {
      color: 'grey',
      click: 1,
      clicked: 0,
      score: 1,
      life: 0,
      border: -1,
    },
    {
      color: 'green',
      click: 1,
      clicked: 0,
      score: 1,
      life: 1,
      border: 0,
    },
    {
      color: 'yellow',
      click: 2,
      clicked: 0,
      score: 1,
      life: 0,
      border: -2,
    },
    {
      color: 'red',
      click: 3,
      clicked: 0,
      score: 1,
      life: 0,
      border: -3,
    }
  ]
  // 随机颜色类0-5，random包括0不包括5
  const color = colorConfig[random(0, colorConfig.length)];
  return color;
}

// 定义 User 构造器，默认生命值5，分数0
function User(name = '', life = 5, score = 0) {
  this.name = name;
  this.life = life; // 生命值
  this.score = score; // 得分
}

// 定义User更新函数
User.prototype.update = function(key, value = '') {
  if (key in this) {
    this[key] = value
  }
};

// 定义User更新dom函数
User.prototype.updateText = function() {
  document.getElementById('name').innerText = this.name
  document.getElementById('life').innerText = this.life
  document.getElementById('score').innerText = this.score
};

// 定义 Ball 构造器
function Ball(x, y, velX, velY, color, size) {
  this.x = x; // x坐标
  this.y = y; // y坐标
  this.velX = velX; // x轴速度
  this.velY = velY; // y轴速度
  this.color = color; // 颜色类
  this.size = size; // 半径大小
}

// 定义彩球绘制函数
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数
Ball.prototype.update = function() {
  // 是否触到下边界
  if((this.y + this.size) >= height) {
    const ball = this
    // 球触到下边界的处理
    borderWork(ball)
    // 重置
    const size = random(ballConfig.minSize, ballConfig.maxSize);
    this.x = random(0 + size, width - size);
    this.y = size;
    this.velX = random(ballConfig.minVel, ballConfig.maxVel);
    this.velY = random(ballConfig.minVel, ballConfig.maxVel);
    this.color = randomColor();
    this.size = size;
  }
  this.y += this.velY;
};

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // 检测两个小球是否相撞：两个小球中心的距离是否小于两个小球的半径之和
      if (distance < this.size + balls[j].size) {
        // 碰撞则改变颜色
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

//点击事件
canvas.onclick=function(e){
  for(let j = 0; j < balls.length; j++) {
    const dx = e.offsetX - balls[j].x;
    const dy = e.offsetY - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 是否在此球和其周围发生的点击事件
    if (distance < balls[j].velY + 2 * balls[j].size) {
      console.log('distance', distance);
      balls[j].color.clicked += 1;
      // 满足点击次数要求
      if (balls[j].color.clicked >= balls[j].color.click) {
        const ball = balls[j]
        // 点击球的处理
        clickWork(ball)
        // 重置
        const size = random(ballConfig.minSize, ballConfig.maxSize);
        balls[j].x = random(0 + size, width - size);
        balls[j].y = size;
        balls[j].velX = random(ballConfig.minVel, ballConfig.maxVel);
        balls[j].velY = random(ballConfig.minVel, ballConfig.maxVel);
        balls[j].color = randomColor();
        balls[j].size = size;
      }
    }
  }
}

// 球触到下边界的处理
function borderWork(ball) {
  // console.log('borderWork ball', ball)
  user.life += ball.color.border
  console.log('color: ' + ball.color.color + '，border: ' + ball.color.border + '，life: ' + user.life)
  user.life = user.life < 0 ? 0 : user.life
  user.updateText()
  if (user.life <= 0) {
    // 需使用线程调用pauseGame()
    const st = setTimeout(() => {
      pauseGame()
      clearTimeout(st)
      alert('游戏结束')
    }, 100);
  }
}

// 点击球的处理
function clickWork(ball) {
  // console.log('clickWork ball', ball)
  user.score += ball.color.score
  user.life += ball.color.life
  console.log('color: ' + ball.color.color + '，click: ' + ball.color.click+ '，clicked: ' + ball.color.clicked + '，life: ' + user.life)
  user.life = user.life < 0 ? 0 : user.life
  user.updateText()
  if (user.life <= 0) {
    // 需使用线程调用pauseGame()
    const st = setTimeout(() => {
      pauseGame()
      clearTimeout(st)
      alert('游戏结束')
    }, 100);
  }
}

// 定义玩家
let user = {}
function initUser() {
  user = new User('MONSTER')
  user.updateText()
}

// 定义一个数组，生成并保存所有的球
let balls = [];
function initBalls() {
  balls = balls.splice(0, balls.length)
  while(balls.length < ballConfig.maxLen) {
    const size = random(ballConfig.minSize, ballConfig.maxSize);
    let ball = new Ball(
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      size,
      random(ballConfig.minVel, ballConfig.maxVel),
      random(ballConfig.minVel, ballConfig.maxVel),
      randomColor(),
      size
    );
    balls.push(ball);
  }
  ctx.fillStyle = ballConfig.bgColor;
  ctx.fillRect(0, 0, width, height);
}

// 动画兼容性
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// 定义一个循环来不停地播放
let myReq;
function loop() {
  // 将整个画布的颜色设置成半透明的黑色，在下一个视图画出来时用来遮住之前的视图的。如果不这样做得话，你就会在屏幕上看到一条蛇的形状而不是小球的运动了。
  ctx.fillStyle = ballConfig.transColor;
  ctx.fillRect(0, 0, width, height);

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  
  myReq = requestAnimationFrame(loop);
}

// 开始动画
function startGame() {
  myReq = requestAnimationFrame(loop);
}

// 暂停动画
function pauseGame() {
  if(myReq) {
    cancelAnimationFrame(myReq);
  }
}

// 重来
function againGame() {
  pauseGame()
  initBalls()
  initUser()
}
againGame()
