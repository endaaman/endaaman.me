export default function date(value, arg) {
  if (!value) {
    return ''
  }
  return JSON.stringify(value, null, arg || 2)
}
