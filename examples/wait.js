module.exports = function (fn, wait) {
  const id = setInterval(() => {
    fn()
    clearInterval(id)
  }, wait)
}
