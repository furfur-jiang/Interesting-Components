
  const prizeNum = consts.prizeList.length
  const perAngle = 360 / prizeNum
  const offsetAngle = perAngle / 2
  const circleCount = 3 //旋转圈数
  const rotateDuration = 3  // 持续时间
  const panel = document.querySelector('.luckpanel')
  
  let isRotating = false
  
  // 画出盘面
  function drawPanel() {
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const dpr = window.devicePixelRatio
    // 处理设备分辨率
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
  
    // 将画布逆时针旋转90°
    ctx.translate(0, h)
    ctx.rotate(-90 * Math.PI / 180)
  
    ctx.strokeStyle = consts.borderColor
  
    const perRadian = (Math.PI * 2) / prizeNum
    for (let i = 0; i < prizeNum; i++) {
      const radian = perRadian * i
      ctx.beginPath()
      console.log(i)
      if (i % 2 === 0) {
        ctx.fillStyle = consts.prizeBgColors[0] 
      }else {
        ctx.fillStyle = consts.prizeBgColors[1]
      }
      console.log(ctx.fillStyle)
      ctx.moveTo(w / 2, h / 2)
      ctx.arc(w / 2, h / 2, w / 2, radian, radian + perRadian, false) // 顺时针
      ctx.closePath()
      ctx.stroke()
      ctx.fill()
    }
  }
  // 画出每一块，其具体内容
  function getPrizeItem({ name, src }) {
    const el = document.createElement('div')
    const tpl = `
      <div class="prize-item">
        <div class="prize-item__name">${name}</div>
        <div class="prize-item__img">
          <img src="${src}" alt="">
        </div>
      </div>
    `
    el.innerHTML = tpl
  
    return el.firstElementChild
  }
  // 填充进去
  function fillPrize() {
    const container = document.querySelector('.prize');
    consts.prizeList.forEach((item, i) => {
      const el = getPrizeItem({
        name: item.prizeName,
        src: item.prizeImg
      })
  
      // 旋转
      const currentAngle = perAngle * i + offsetAngle
      el.style.transform = `rotate(${currentAngle}deg)`
  
      container.appendChild(el)
    })
  }
  
  let startRotateAngle = 0
  
  function rotate(index) {
    const rotateAngle = (
      startRotateAngle +
      circleCount * 360 +
      360 - (perAngle * index + offsetAngle) -
      startRotateAngle % 360
    );
  
    startRotateAngle = rotateAngle
    panel.style.transform = `rotate(${rotateAngle}deg)`
    panel.style.transitionDuration = `${rotateDuration}s`
  
    setTimeout(() => {
      rotateEnd(index)
    }, rotateDuration * 1000);
  }
  
  function rotateEnd(index) {
    isRotating = false
  
    alert(consts.prizeList[index].prizeName)
  }
  
  function bindEvent() {
    document.querySelector('.pointer').addEventListener('click', function () {
      if (isRotating) {
        return
      } else {
        isRotating = true
      }
  
      // const index = Math.floor(Math.random() * prizeNum)
      const index = computedPrize()
      rotate(index)
    })
  }
  function computedPrize() {
    let sum = 0, prizeArr = []
    consts.prizeList.forEach(item => {
      sum += item.percent
      let percent = item.percent
      while (percent > 0) {
        prizeArr.push(item)
        percent--
      }
    })
    const prizeArrIndex = Math.floor(Math.random() * prizeArr.length)
    let index
    consts.prizeList.forEach((item, i) => {
      if (item === prizeArr[prizeArrIndex]) {
        index = i
      }
    })
    console.log(index)
    return index
  }
  
  function init() {
    drawPanel()
    fillPrize()
    bindEvent()
  }
  document.addEventListener('DOMContentLoaded', init)

