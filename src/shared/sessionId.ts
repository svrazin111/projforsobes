export const getSessionId = () => {
  const sessionIdNumb = (
    new Date().getFullYear() * 10000000000000 +
    new Date().getMonth() * 100000000000 +
    new Date().getDate() * 1000000000 +
    new Date().getHours() * 10000000 +
    new Date().getMinutes() * 100000 +
    new Date().getSeconds() * 1000 +
    new Date().getMilliseconds()
  )
    .toString()
    .substr(0, 16)
  return sessionIdNumb
}
