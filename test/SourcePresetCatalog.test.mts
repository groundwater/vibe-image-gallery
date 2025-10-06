import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { SourcePresetCatalog, SourcePresetGroup } from '../src/lib/SourcePresetCatalog.mts'
import { GallerySourceKind } from '../src/lib/GallerySourceFactory.mts'

interface ExpectedGroup {
  readonly label: string
  readonly kind: GallerySourceKind
  readonly values: readonly string[]
}

const redditGroups: readonly ExpectedGroup[] = [
  {
    label: 'Nature',
    kind: 'reddit',
    values: [
      'EarthPorn',
      'BotanicalPorn',
      'WaterPorn',
      'SeaPorn',
      'SkyPorn',
      'FirePorn',
      'DesertPorn',
      'WinterPorn',
      'AutumnPorn',
      'WeatherPorn',
      'GeologyPorn',
      'SpacePorn',
      'BeachPorn',
      'MushroomPorn',
      'SpringPorn',
      'SummerPorn',
      'LavaPorn',
      'LakePorn'
    ]
  },
  {
    label: 'City',
    kind: 'reddit',
    values: [
      'CityPorn',
      'ArchitecturePorn',
      'SkylinePorn',
      'Skyscrapers',
      'UrbanPorn',
      'UrbanExploration',
      'AbandonedPorn'
    ]
  },
  {
    label: 'Synthetic',
    kind: 'reddit',
    values: [
      'CityPorn',
      'VillagePorn',
      'RuralPorn',
      'ArchitecturePorn',
      'HousePorn',
      'CabinPorn',
      'ChurchPorn',
      'AbandonedPorn',
      'CemeteryPorn',
      'InfrastructurePorn',
      'MachinePorn',
      'CarPorn',
      'F1Porn',
      'MotorcyclePorn',
      'MilitaryPorn',
      'GunPorn',
      'KnifePorn',
      'BoatPorn',
      'RidesPorn',
      'DestructionPorn',
      'ThingsCutInHalfPorn',
      'StarshipPorn',
      'ToolPorn',
      'TechnologyPorn',
      'BridgePorn',
      'PolicePorn',
      'SteamPorn',
      'RetailPorn',
      'SpaceFlightPorn',
      'RoadPorn',
      'DryDockPorn'
    ]
  },
  {
    label: 'Organic',
    kind: 'reddit',
    values: [
      'AnimalPorn',
      'HumanPorn',
      'EarthlingPorn',
      'AdrenalinePorn',
      'ClimbingPorn',
      'SportsPorn',
      'AgriculturePorn',
      'TeaPorn',
      'BonsaiPorn',
      'FoodPorn',
      'CulinaryPorn',
      'DessertPorn'
    ]
  },
  {
    label: 'Aesthetic',
    kind: 'reddit',
    values: [
      'DesignPorn',
      'RoomPorn',
      'AlbumArtPorn',
      'MetalPorn',
      'MoviePosterPorn',
      'TelevisionPosterPorn',
      'ComicBookPorn',
      'StreetArtPorn',
      'AdPorn',
      'ArtPorn',
      'FractalPorn',
      'InstrumentPorn',
      'ExposurePorn',
      'MacroPorn',
      'MicroPorn',
      'GeekPorn',
      'MTGPorn',
      'GamerPorn',
      'PowerWashingPorn',
      'AerialPorn',
      'OrganizationPorn',
      'FashionPorn',
      'AVPorn',
      'ApocalypsePorn',
      'InfraredPorn',
      'ViewPorn',
      'HellscapePorn',
      'SculpturePorn'
    ]
  },
  {
    label: 'Scholastic',
    kind: 'reddit',
    values: [
      'HistoryPorn',
      'UniformPorn',
      'BookPorn',
      'NewsPorn',
      'QuotesPorn',
      'FuturePorn',
      'FossilPorn',
      'MegalithPorn',
      'ArtefactPorn'
    ]
  }
]

const gatedGroups: readonly ExpectedGroup[] = [
  {
    label: 'Flickr',
    kind: 'flickr',
    values: [
      'landscape',
      'architecture',
      'street photography',
      'wildlife'
    ]
  },
  {
    label: 'Wikimedia Commons',
    kind: 'wikimedia-commons',
    values: [
      'aurora borealis',
      'astronomy',
      'wildlife',
      'architecture'
    ]
  },
  {
    label: 'The Met Museum',
    kind: 'met-museum',
    values: [
      'sunflower',
      'impressionism',
      'armor',
      'portrait'
    ]
  }
]

function VERIFY_GROUPS(groups: readonly SourcePresetGroup[], expected: readonly ExpectedGroup[]): void {
  assert.equal(groups.length, expected.length)
  for (const expectedGroup of expected) {
    const group = groups.find((candidate) => candidate.label === expectedGroup.label)
    assert.ok(group, `missing preset group ${expectedGroup.label}`)
    const seen = new Set<string>()
    for (const entry of group.entries) {
      assert.equal(entry.kind, expectedGroup.kind)
      const normalized = entry.value.toLowerCase()
      assert.ok(!seen.has(normalized), `duplicate value ${entry.value} in ${group.label}`)
      seen.add(normalized)
    }
    for (const value of expectedGroup.values) {
      const found = group.entries.some((entry) => entry.value === value)
      assert.ok(found, `missing value ${value} in ${group.label}`)
    }
    assert.equal(group.entries.length, expectedGroup.values.length)
  }
}

test('preset catalog excludes gated sources without toggles', () => {
  const groups = SourcePresetCatalog.All()
  VERIFY_GROUPS(groups, redditGroups)
})

test('preset catalog includes gated sources when toggles enabled', () => {
  const originalWindow = Reflect.get(globalThis, 'window')
  try {
    const fakeWindow = { location: { search: '?flickr=on&wikimedia=on&met=on' } }
    Object.defineProperty(globalThis, 'window', {
      value: fakeWindow,
      configurable: true
    })
    const groups = SourcePresetCatalog.All()
    VERIFY_GROUPS(groups, [...redditGroups, ...gatedGroups])
  } finally {
    if (typeof originalWindow === 'undefined') {
      Reflect.deleteProperty(globalThis, 'window')
    } else {
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        configurable: true
      })
    }
  }
})
