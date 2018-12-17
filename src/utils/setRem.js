(function (doc, win) {
   
    let docEl = doc.documentElement
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    let recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 32 * (clientWidth / 375) + 'px'
      if (clientWidth >= 750) docEl.style.fontSize = 32 + 'px'
      console.log(32 * (clientWidth / 750));
    //   alert(333333333333333);
    }
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  })(document, window)