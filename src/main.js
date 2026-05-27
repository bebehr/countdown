import './scss/style.scss'
import * as bootstrap from 'bootstrap' // eslint-disable-line no-unused-vars

import { setupCountdown } from './js/countdown.js'

setupCountdown(document.querySelector('#app'))
