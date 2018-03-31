export default function date(value, arg) {
  const precision = 1
  const size = parseInt(value)
  if (isNaN(parseFloat(size)) || !isFinite(size)) {
    return '-'
  }
  const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
  const number = size === 0
    ? 0
    : Math.floor(Math.floor(Math.log(size)) / Math.log(1024))
  return (size / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number]
}
