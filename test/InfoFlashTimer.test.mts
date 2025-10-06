import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { InfoFlashTimer } from '../src/lib/InfoFlashTimer.mts'

test('flash invokes callback after the specified duration', async () => {
  let invoked = false
  const timer = InfoFlashTimer.Create(() => {
    invoked = true
  })
  timer.Flash(10)
  await new Promise((resolve) => setTimeout(resolve, 30))
  assert.equal(invoked, true)
  timer.Dispose()
})

test('cancel prevents the callback from running', async () => {
  let invoked = false
  const timer = InfoFlashTimer.Create(() => {
    invoked = true
  })
  timer.Flash(20)
  timer.Cancel()
  await new Promise((resolve) => setTimeout(resolve, 40))
  assert.equal(invoked, false)
  timer.Dispose()
})
