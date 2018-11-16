const validatePort = port => port.replace(/\D+/g, '')

module.exports = {
  validatePort,
}