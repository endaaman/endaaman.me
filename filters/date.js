import fecha from 'fecha'


export default function date(value, arg) {
  if (!value) {
    return ''
  }
  return fecha.format(new Date(value), arg || 'YYYY年MM月DD日')
}
