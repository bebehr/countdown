import './scss/style.scss'
import * as bootstrap from 'bootstrap' // eslint-disable-line no-unused-vars

import { setupCounter } from './js/counter.js'

document.querySelector('#app').innerHTML = `
<section>
  <div>
    <p>Edit <code>src/main.js</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="btn btn-primary"></button>
</section>`

setupCounter(document.querySelector('#counter'))
