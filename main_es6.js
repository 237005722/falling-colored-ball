// 设置画布
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

// 定义关于 ctx 的常量
let ctxConfig = {
  bgColor: 'rgba(0, 0, 0)', // 背景颜色
  transColor: 'rgba(0, 0, 0, 0.25)' // 球的运动过渡背景颜色，透明度越高，球的运动轨迹越明显
}

// 定义玩家
let user = {}
function initUser() {
  user = JSON.parse('{}')
  user = new User()
  user.updateText()
}

// 初始化所有彩球
function initBalls() {
  Ball.initBalls({ width, height })
  ctx.fillStyle = ctxConfig.bgColor
  ctx.fillRect(0, 0, width, height)
}

// 定义关于 ctx 的点击事件
canvas.onclick = function(e) {
  for(let j = 0; j < Ball.balls.length; j++) {
    const dx = e.offsetX - Ball.balls[j].x
    const dy = e.offsetY - Ball.balls[j].y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // 是否在此球和其周围发生的点击事件
    if (distance < Ball.balls[j].velY + 2 * Ball.balls[j].size) {
      console.log('distance', distance)
      Ball.balls[j].color.clicked += 1
      // 满足点击次数要求
      if (Ball.balls[j].color.clicked >= Ball.balls[j].color.click) {
        // 点击球的处理
        clickWork(Ball.balls[j])
        // 重置
        Ball.balls[j].init({ width, height })
      }
    }
  }
}

// 球触到下边界的处理
function borderWork(ball) {
  // console.log('borderWork ball', ball)
  if (user.life <= 0) return
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
    }, 100)
  }
}

// 点击球的处理
function clickWork(ball) {
  // console.log('clickWork ball', ball)
  if (user.life <= 0) return
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
    }, 100)
  }
}

// 动画兼容性
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

// 定义一个循环来不停地播放
let myReq
function loop() {
  // 将整个画布的颜色设置成半透明的黑色，在下一个视图画出来时用来遮住之前的视图的。如果不这样做得话，你就会在屏幕上看到一条蛇的形状而不是小球的运动了。
  ctx.fillStyle = ctxConfig.transColor
  ctx.fillRect(0, 0, width, height)

  for(let i = 0; i < Ball.balls.length; i++) {
    Ball.balls[i].draw(ctx)
    Ball.balls[i].update({ width, height, borderWork })
    Ball.balls[i].collisionDetect()
  }
  
  myReq = requestAnimationFrame(loop)
}

// 开始动画
function startGame() {
  if (user.life <= 0) {
    alert('生命值为0，请点击重来')
    return
  }
  myReq = requestAnimationFrame(loop)
}

// 暂停动画
function pauseGame() {
  if(myReq) {
    cancelAnimationFrame(myReq)
    myReq = null
  }
}

// 重来
function againGame() {
  pauseGame()
  initBalls()
  initUser()
}
againGame()

// 玩法
function showIntroduce() {
  showSomeDom('introduce')
}

// 设置
function showSetting() {
  pauseGame()
  showSomeDom('setting')
}

// 保存设置
function saveSetting() {
  // 设置球相关属性
  const keys = Object.keys(Ball.ballConfig)
  keys.forEach(key => {
    if (document.getElementsByName(key).length > 0) {
      Ball.ballConfig[key] = Number(document.getElementsByName(key)[0].value)
    }
  })
  console.log('Ball.ballConfig', Ball.ballConfig)

  // 设置玩家相关属性
  const userKeys = Object.keys(User.userConfig)
  userKeys.forEach(key => {
    if (document.getElementsByName(key).length > 0) {
      User.userConfig[key] = Number(document.getElementsByName(key)[0].value)
    }
  })
  console.log('User.userConfig', User.userConfig)

  againGame()
  showSomeDom('setting')

}

// 显示或隐藏dom
function showSomeDom(selector) {
  const el = document.querySelector(selector)
  el.style.visibility = el.style.visibility === 'visible' ? 'hidden' : 'visible'
}
