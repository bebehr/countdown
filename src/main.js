import './scss/style.scss'
import * as bootstrap from 'bootstrap' // eslint-disable-line no-unused-vars

import { setupCountdown } from './js/countdown.js'

function initTheme () {
  const getPreferredTheme = () => {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme) {
      return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    window.localStorage.setItem('theme', theme)
    updateButtonLabel(theme)
  }

  const updateButtonLabel = theme => {
    const toggleBtn = document.querySelector('#theme-toggle')
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel'
    }
  }

  const currentTheme = getPreferredTheme()
  setTheme(currentTheme)

  const toggleBtn = document.querySelector('#theme-toggle')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-bs-theme')
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
    })
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!window.localStorage.getItem('theme')) {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  })
}

initTheme()
setupCountdown(document.querySelector('#app'))
