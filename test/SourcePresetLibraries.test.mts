import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { RedditSourcePresets } from '../src/lib/plugins/RedditImageSourcePlugin.mts'
import { FlickrSourcePresets } from '../src/lib/plugins/FlickrImageSourcePlugin.mts'
import { WikimediaCommonsSourcePresets } from '../src/lib/plugins/WikimediaCommonsImageSourcePlugin.mts'
import { MetMuseumSourcePresets } from '../src/lib/plugins/MetMuseumImageSourcePlugin.mts'
import { SourcePresetGroup } from '../src/lib/SourcePreset.mts'
import { GallerySourceKind } from '../src/lib/GallerySourceFactory.mts'

interface ExpectedGroup {
  readonly label: string
  readonly kind: GallerySourceKind
  readonly values: readonly string[]
}

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

test('reddit presets are grouped by theme', () => {
  const expected: readonly ExpectedGroup[] = [
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
  VERIFY_GROUPS(RedditSourcePresets.Groups(), expected)
})

test('flickr presets focus on common themes', () => {
  const expected: readonly ExpectedGroup[] = [
    {
      label: 'Landscapes',
      kind: 'flickr',
      values: ['landscape', 'mountain sunrise', 'desert dusk']
    },
    {
      label: 'City Life',
      kind: 'flickr',
      values: ['architecture', 'cityscape night', 'urban reflections']
    },
    {
      label: 'Street Moments',
      kind: 'flickr',
      values: ['street photography', 'documentary street', 'black and white street']
    },
    {
      label: 'Wildlife',
      kind: 'flickr',
      values: ['wildlife', 'birds in flight', 'macro insects']
    }
  ]
  VERIFY_GROUPS(FlickrSourcePresets.Groups(), expected)
})

test('wikimedia presets cover varied collections', () => {
  const expected: readonly ExpectedGroup[] = [
    {
      label: 'Sky Phenomena',
      kind: 'wikimedia-commons',
      values: ['aurora borealis', 'astronomy', 'space exploration']
    },
    {
      label: 'Wildlife',
      kind: 'wikimedia-commons',
      values: ['wildlife', 'birds in flight', 'marine life']
    },
    {
      label: 'Architecture',
      kind: 'wikimedia-commons',
      values: ['architecture', 'cathedrals', 'modern architecture']
    }
  ]
  VERIFY_GROUPS(WikimediaCommonsSourcePresets.Groups(), expected)
})

test('met presets span major departments', () => {
  const expected: readonly ExpectedGroup[] = [
    {
      label: 'Paintings',
      kind: 'met-museum',
      values: ['impressionism', 'portrait', 'landscape painting']
    },
    {
      label: 'Sculpture & Armor',
      kind: 'met-museum',
      values: ['armor', 'bronze sculpture', 'classical sculpture']
    },
    {
      label: 'Decorative Arts',
      kind: 'met-museum',
      values: ['sunflower', 'ceramics', 'textiles']
    }
  ]
  VERIFY_GROUPS(MetMuseumSourcePresets.Groups(), expected)
})
