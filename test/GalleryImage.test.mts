import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { GalleryImage } from '../src/lib/GalleryImage.mts'
import { GET_RANDOM_INDEX } from '../src/lib/Random.mts'

test('creates gallery image with provided data', () => {
  const image = GalleryImage.Create({
    url: 'https://example.com/photo.jpg',
    label: 'Example Photo',
    sourceType: 'reddit'
  })
  assert.equal(image.url, 'https://example.com/photo.jpg')
  assert.equal(image.label, 'Example Photo')
  assert.equal(image.sourceType, 'reddit')
})

test('rejects empty url during creation', () => {
  assert.throws(() => {
    GalleryImage.Create({
      url: ' ',
      label: 'Bad',
      sourceType: 'unsplash'
    })
  })
})

test('random index falls within bounds', () => {
  const length = 5
  for (let i = 0; i < 50; i += 1) {
    const value = GET_RANDOM_INDEX(length)
    assert.ok(value >= 0)
    assert.ok(value < length)
  }
})
