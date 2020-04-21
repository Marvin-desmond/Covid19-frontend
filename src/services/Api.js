import axios from 'axios'

export default () => {
 return axios.create({
    baseURL:'https://cv19-backend.herokuapp.com/'
 })
}