export default function (to, from, savedPosition) {
  const offset = savedPosition || { x: 0, y: 0 }
  console.log(savedPosition, offset)
  return offset
  // return new Promise((r) => {
  //   setTimeout(() => {
  //     r(offset)
  //   }, 1000)
  // })
}
