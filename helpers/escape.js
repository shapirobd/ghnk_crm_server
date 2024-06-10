const escape = (str) => {
  return str.replaceAll("'", "\\'")
}

module.exports = escape;