// 定义玩家类
class User {

  /* 定义玩家的公共属性 */
  constructor ({ name = 'SomeBody', life = User.userConfig.life, score = User.userConfig.score } = {}) {
    this.name = name // 昵称
    this.life = life // 生命值
    this.score = score // 得分
  }

  // 定义关于 玩家 的常量，可设置
  static userConfig = {
    life: 5, // 初始生命值
    score: 0 // 初始得分
  }

  // 定义User更新函数
  update ({ key, value = '' } = {}) {
    if (key in this) {
      this[key] = value
    }
  }

  // 定义User更新dom函数
  updateText (keys = ['name', 'life', 'score']) {
    keys.forEach(key => {
      if (document.getElementById(key)) {
        document.getElementById(key).innerText = this[key]
      }
    })
  }
}