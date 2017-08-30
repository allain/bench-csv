module.exports = (objs, delim = ',', header = true) =>
  [header ? Object.keys(objs[0]) : null]
    .concat(objs.map(obj => Object.values(obj)))
    .filter(Boolean)
    .map(parts => parts.map(part => JSON.stringify('' + part)).join(delim))
    .join('\n')
