import messages from './messages'

const getMessages = (locale) => {
  const keys = Object.keys(messages)
  const getMessage = (key) => {
    if (locale === 'en-US') return messages[key][1]
    return messages[key][0]
  }

  return keys.reduce((map, key) => {
    map[key] = getMessage(key)
    return map
  }, {})
}

export default getMessages
