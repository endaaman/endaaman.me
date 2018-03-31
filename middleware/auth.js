export default function ({ store, error }) {
  if (!store.state.authorized) {
    error({
      message: 'You are not me.',
      statusCode: 403
    })
  }
}
