import axios from 'axios'
import { setup } from 'axios-cache-adapter'

export default ({ app }, inject) => {
  const cache = setup({
    cache: {
      maxAge: 15 * 60 * 1000,
    },
    baseURL: 'https://jsonplaceholder.typicode.com',
  })

  inject('axios', cache)
}
