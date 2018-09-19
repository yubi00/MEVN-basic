
import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `mongodb://yubi:12tomhanks@ds255332.mlab.com:55332/posts`
  })
}