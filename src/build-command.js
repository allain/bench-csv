module.exports = argv =>
  [(argv._ || []).join(' '), buildParams(argv)].filter(Boolean).join(' ')

const buildParams = obj =>
  Object.keys(obj)
    .map(name => buildParam(name, obj[name]))
    .filter(Boolean)
    .join(' ')

function buildParam (name, value) {
  if (name === '_') return ''

  switch (value) {
    case true:
      return `--${name}`
    case false:
      return `--${name}=false`
    default:
      return `--${name}="${value}"`
  }
}
