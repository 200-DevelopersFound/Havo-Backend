const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports = function (email) {
  return re.test(email);
};

module.exports = reg;
