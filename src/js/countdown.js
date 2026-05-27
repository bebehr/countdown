import { Temporal } from '@js-temporal/polyfill'

export function setupCountdown (element) {
  const startDate = new Temporal.PlainDate(2026, 5, 1)
  const endDate = new Temporal.PlainDate(2028, 5, 1)
  const currentDate = Temporal.Now.plainDateISO()
  const daysTotal = endDate.since(startDate).days
  const daysLeft = endDate.since(currentDate).days
  const daysPassed = currentDate.since(startDate).days
  const progressDone = Math.round(daysPassed / daysTotal * 100)
  const progressLeft = 100 - progressDone

  const customHolidays = [
    new Temporal.PlainDate(2026, 5, 15),
    new Temporal.PlainDate(2026, 6, 5),
    new Temporal.PlainDate(2027, 5, 7),
    new Temporal.PlainDate(2027, 5, 28)
  ]

  const renderCountdown = () => {
    document.querySelector('#start-date').setAttribute('datetime', startDate.toString())
    document.querySelector('#start-date').innerHTML = startDate.toLocaleString('de-DE', { dateStyle: 'short' })
    document.querySelector('#end-date').setAttribute('datetime', endDate.toString())
    document.querySelector('#end-date').innerHTML = endDate.toLocaleString('de-DE', { dateStyle: 'short' })
    document.querySelector('#days-total').innerHTML = daysTotal
    document.querySelector('#days-passed').innerHTML = daysPassed
    document.querySelector('#progress-done').setAttribute('aria-valuenow', progressDone)
    document.querySelector('#progress-done').setAttribute('style', `width: ${progressDone}%`)
    document.querySelector('#progress-done-label').innerHTML = progressDone + '%'
    document.querySelector('#progress-left').setAttribute('aria-valuenow', progressLeft)
    document.querySelector('#progress-left').setAttribute('style', `width: ${progressLeft}%`)
    document.querySelector('#progress-left-label').innerHTML = progressLeft + '%'
    document.querySelector('#count-down').innerHTML = daysLeft
    document.querySelector('#workdays-left').innerHTML = workdaysLeft
  }

  const getWorkdaysLeft = () => {
    let current = currentDate
    let workdays = 0
    while (Temporal.PlainDate.compare(current, endDate) < 0) {
      const dayOfWeek = current.dayOfWeek
      const isHoliday = customHolidays.some(holiday =>
        Temporal.PlainDate.compare(current, holiday) === 0
      )
      if (dayOfWeek !== 6 && dayOfWeek !== 7 && !isHoliday) {
        workdays++
      }
      current = current.add({ days: 1 })
    }
    return workdays
  }

  const workdaysLeft = getWorkdaysLeft()
  renderCountdown()
}
