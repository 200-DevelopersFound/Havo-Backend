const CryptoJS = require("crypto-js");
// Function to encode the object
async function encode(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    "secret key 123"
  ).toString();
}

// Function to decode the object
async function decode(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

module.exports = { encode, decode };
