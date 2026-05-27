import { Temporal } from '@js-temporal/polyfill'
import axios from 'axios'

export async function setupCountdown (element) {
  const startDate = new Temporal.PlainDate(2026, 5, 1)
  const endDate = new Temporal.PlainDate(2028, 5, 1)
  const daysTotal = endDate.since(startDate).days

  const customHolidays = [
    '2026-05-15',
    '2026-06-05',
    '2027-05-07',
    '2027-05-28'
  ]

  const allHolidays = new Set(customHolidays)
  let intervalId = null

  try {
    const startYear = startDate.year
    const endYear = endDate.year
    const years = []
    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }

    const requests = years.map(year =>
      axios.get('https://feiertage-api.de/api/', {
        params: {
          jahr: year,
          nur_land: 'NW'
        }
      })
    )

    const responses = await axios.all(requests)

    responses.forEach(response => {
      const holidaysObject = response.data
      Object.values(holidaysObject).forEach(holiday => {
        if (holiday.datum) {
          allHolidays.add(holiday.datum)
        }
      })
    })
  } catch (error) {
    console.error('Feiertage konnten nicht geladen werden', error)
  } finally {
    const overlay = document.querySelector('#loading-overlay')
    if (overlay) {
      overlay.classList.add('d-none')
    }
  }

  const getWorkdaysLeft = (fromZoneISO) => {
    let current = fromZoneISO
    let workdays = 0
    while (Temporal.PlainDate.compare(current, endDate) < 0) {
      const dayOfWeek = current.dayOfWeek
      const isHoliday = allHolidays.has(current.toString())
      if (dayOfWeek !== 6 && dayOfWeek !== 7 && !isHoliday) {
        workdays++
      }
      current = current.add({ days: 1 })
    }
    return workdays
  }

  const renderCountdown = () => {
    const currentDate = Temporal.Now.plainDateISO()

    document.querySelector('#start-date').setAttribute('datetime', startDate.toString())
    document.querySelector('#start-date').innerHTML = startDate.toLocaleString('de-DE', { dateStyle: 'short' })
    document.querySelector('#end-date').setAttribute('datetime', endDate.toString())
    document.querySelector('#end-date').innerHTML = endDate.toLocaleString('de-DE', { dateStyle: 'short' })
    document.querySelector('#days-total').innerHTML = daysTotal

    if (Temporal.PlainDate.compare(currentDate, endDate) >= 0) {
      if (intervalId) clearInterval(intervalId)

      document.querySelector('#days-passed').innerHTML = daysTotal
      document.querySelector('#count-down').innerHTML = '0'
      document.querySelector('#workdays-left').innerHTML = '0'

      document.querySelector('#progress-done').setAttribute('aria-valuenow', 100)
      document.querySelector('#progress-done').style.width = '100%'
      document.querySelector('#progress-done-label').innerHTML = '100%'

      document.querySelector('#progress-left').setAttribute('aria-valuenow', 0)
      document.querySelector('#progress-left').style.width = '0%'
      document.querySelector('#progress-left-label').innerHTML = ''
      return
    }

    if (Temporal.PlainDate.compare(currentDate, startDate) < 0) {
      document.querySelector('#days-passed').innerHTML = '0'
      document.querySelector('#count-down').innerHTML = endDate.since(startDate).days
      document.querySelector('#workdays-left').innerHTML = getWorkdaysLeft(startDate)

      document.querySelector('#progress-done').setAttribute('aria-valuenow', 0)
      document.querySelector('#progress-done').style.width = '0%'
      document.querySelector('#progress-done-label').innerHTML = ''

      document.querySelector('#progress-left').setAttribute('aria-valuenow', 100)
      document.querySelector('#progress-left').style.width = '100%'
      document.querySelector('#progress-left-label').innerHTML = '100%'
      return
    }

    const daysLeft = endDate.since(currentDate).days
    const daysPassed = currentDate.since(startDate).days
    const progressDone = Math.round(daysPassed / daysTotal * 100)
    const progressLeft = 100 - progressDone
    const workdaysLeft = getWorkdaysLeft(currentDate)

    document.querySelector('#days-passed').innerHTML = daysPassed
    document.querySelector('#count-down').innerHTML = daysLeft
    document.querySelector('#workdays-left').innerHTML = workdaysLeft

    document.querySelector('#progress-done').setAttribute('aria-valuenow', progressDone)
    document.querySelector('#progress-done').style.width = `${progressDone}%`
    document.querySelector('#progress-done-label').innerHTML = progressDone > 5 ? `${progressDone}%` : ''

    document.querySelector('#progress-left').setAttribute('aria-valuenow', progressLeft)
    document.querySelector('#progress-left').style.width = `${progressLeft}%`
    document.querySelector('#progress-left-label').innerHTML = progressLeft > 5 ? `${progressLeft}%` : ''
  }

  renderCountdown()
  intervalId = setInterval(renderCountdown, 60 * 60 * 1000)
}
