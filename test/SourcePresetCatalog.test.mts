import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { SourcePresetCatalog } from '../src/lib/SourcePresetCatalog.mts'

const expectedGroups = [
  {
    label: 'Nature',
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

test('preset catalog contains expected groups without duplicates', () => {
  const groups = SourcePresetCatalog.All()
  assert.equal(groups.length, expectedGroups.length)

  for (const expected of expectedGroups) {
    const group = groups.find((candidate) => candidate.label === expected.label)
    assert.ok(group, `missing preset group ${expected.label}`)
    const seen = new Set<string>()
    for (const entry of group.entries) {
      assert.equal(entry.kind, 'reddit')
      const normalized = entry.value.toLowerCase()
      assert.ok(!seen.has(normalized), `duplicate subreddit ${entry.value} in ${group.label}`)
      seen.add(normalized)
    }
    for (const value of expected.values) {
      const found = group.entries.some((entry) => entry.value === value)
      assert.ok(found, `missing subreddit ${value} in ${group.label}`)
    }
    assert.equal(group.entries.length, expected.values.length)
  }
})
