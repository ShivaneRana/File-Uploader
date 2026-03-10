function getSize(bytes) {
  if (bytes < 1000) {
    return `${bytes} bytes`;
  } else if (bytes < 1000 * 1000) {
    return `${(bytes / 1000).toFixed(2)} kb`;
  } else if (bytes < 1000 * 1000 * 1000) {
    return `${(bytes / (1000 * 1000)).toFixed(2)} mb`;
  } else {
    return `${(bytes / (1000 * 1000 * 1000)).toFixed(2)} gb`;
  }
}

module.exports = getSize;