function convert(d) {
  return d.constructor === Date
    ? d
    : d.constructor === Array
    ? new Date(d[0], d[1], d[2])
    : d.constructor === Number
    ? new Date(d)
    : d.constructor === String
    ? new Date(d)
    : typeof d === "object"
    ? new Date(d.year, d.month, d.date)
    : NaN;
}

const date = {
  convert: (d) => {
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: (d1, d2) => {
    return isFinite((d1 = convert(d1).valueOf())) &&
      isFinite((d2 = convert(d2).valueOf()))
      ? (d1 > d2) - (d1 < d2)
      : NaN;
  },
  inRange: function (d, start, end) {
    return isFinite((d = convert(d).valueOf())) &&
      isFinite((start = convert(start).valueOf())) &&
      isFinite((end = convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};
module.exports = date;
