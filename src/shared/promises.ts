export const createUserAction = () => {
  let resolve = undefined
  const promise = new Promise((r) => {
    resolve = r
  })

  function done(data) {
    resolve(data)
  }

  function wait() {
    return promise
  }

  return { done, wait }
}
