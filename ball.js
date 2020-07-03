// 定义球类
class Ball {

  /* 定义彩球的公共属性 */
  constructor (x, y, velX, velY, color, size) {
    this.x = x // x坐标
    this.y = y // y坐标
    this.velX = velX // x轴速度
    this.velY = velY // y轴速度
    this.color = color // 颜色类
    this.size = size // 半径大小
  }

  // 定义所有彩球
  static balls = []

  // 定义关于 Ball 的常量，可设置
  static ballConfig = {
    maxLen: 6, // 球的个数
    minSize: 25, // 球的最小半径
    maxSize: 35, // 球的最大半径
    minVel: 1, // 球的最小速度
    maxVel: 4, // 球的最大速度
  }

  // 定义关于 颜色 衍生的属性，5种颜色，随机获取， 可设置
  static colorConfig = [
    {
      color: 'white',
      click: 1, // 需要点击的次数
      clicked: 0, // 已点击的次数，满足click次数后会重置
      score: -1, // 点击一次的得分
      life: -1, // 点击一次得的生命值
      border: 0 // 触到下边界得的生命值
    },
    {
      color: 'grey',
      click: 1,
      clicked: 0,
      score: 1,
      life: 0,
      border: -1
    },
    {
      color: 'green',
      click: 1,
      clicked: 0,
      score: 1,
      life: 1,
      border: 0
    },
    {
      color: 'yellow',
      click: 2,
      clicked: 0,
      score: 1,
      life: 0,
      border: -2
    },
    {
      color: 'red',
      click: 3,
      clicked: 0,
      score: 1,
      life: 0,
      border: -3
    }
  ]

  // 生成随机数的函数
  static random (min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min
    return num
  }

  // 生成随机颜色值的函数
  static randomColor () {
    // 随机颜色类0-5，random包括0不包括5
    return Ball.colorConfig[Ball.random(0, Ball.colorConfig.length)]
  }

  // 初始化所有彩球
  static initBalls ({ width, height } = {}) {
    Ball.balls = JSON.parse('[]')
    while(Ball.balls.length < Ball.ballConfig.maxLen) {
      const size = Ball.random(Ball.ballConfig.minSize, Ball.ballConfig.maxSize)
      Ball.balls.push(new Ball(
        // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
        Ball.random(0 + size, width - size),
        size,
        Ball.random(Ball.ballConfig.minVel, Ball.ballConfig.maxVel),
        Ball.random(Ball.ballConfig.minVel, Ball.ballConfig.maxVel),
        Ball.randomColor(),
        size
      ))
    }
    console.log('initBalls balls', Ball.balls)
  }

  // 定义彩球初始化函数
  init ({ width, height } = {}) {
    const size = Ball.random(Ball.ballConfig.minSize, Ball.ballConfig.maxSize)
    this.x = Ball.random(0 + size, width - size)
    this.y = size
    this.velX = Ball.random(Ball.ballConfig.minVel, Ball.ballConfig.maxVel)
    this.velY = Ball.random(Ball.ballConfig.minVel, Ball.ballConfig.maxVel)
    this.color = Ball.randomColor()
    this.size = size
  }

  // 定义彩球绘制函数
  draw (ctx) {
    if (!ctx) {
      return
    }
    ctx.beginPath()
    ctx.fillStyle = this.color.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 定义彩球更新函数
  update ({ width, height, borderWork } = {}) {
    // 是否触到下边界
    if((this.y + this.size) >= height) {
      // 球触到下边界的处理
      borderWork(this)
      // 重置
      this.init({ width, height })
    }
    this.y += this.velY
  }

  // 定义碰撞检测函数
  collisionDetect () {
    for(let j = 0; j < Ball.balls.length; j++) {
      if(this !== Ball.balls[j]) {
        const dx = this.x - Ball.balls[j].x
        const dy = this.y - Ball.balls[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        // 检测两个小球是否相撞：两个小球中心的距离是否小于两个小球的半径之和
        if (distance < this.size + Ball.balls[j].size) {
          // 碰撞则改变颜色
          Ball.balls[j].color = this.color = Ball.randomColor()
        }
      }
    }
  }
}
