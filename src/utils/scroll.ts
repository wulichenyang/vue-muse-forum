export const getScrollTop = (): number => {
  return document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
}