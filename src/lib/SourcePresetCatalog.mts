import { GallerySourceKind } from './GallerySourceFactory.mts'
import { PageOptions } from './PageOptions.mts'

export interface SourcePresetEntry {
  readonly kind: GallerySourceKind
  readonly value: string
}

export interface SourcePresetGroup {
  readonly label: string
  readonly entries: readonly SourcePresetEntry[]
}

export class SourcePresetCatalog {
  public static All(): readonly SourcePresetGroup[] {
    const groups: SourcePresetGroup[] = [
      this.BuildRedditGroup('Nature', [
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
      ]),
      this.BuildRedditGroup('City', [
        'CityPorn',
        'ArchitecturePorn',
        'SkylinePorn',
        'Skyscrapers',
        'UrbanPorn',
        'UrbanExploration',
        'AbandonedPorn'
      ]),
      this.BuildRedditGroup('Synthetic', [
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
      ]),
      this.BuildRedditGroup('Organic', [
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
      ]),
      this.BuildRedditGroup('Aesthetic', [
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
      ]),
      this.BuildRedditGroup('Scholastic', [
        'HistoryPorn',
        'UniformPorn',
        'BookPorn',
        'NewsPorn',
        'QuotesPorn',
        'FuturePorn',
        'FossilPorn',
        'MegalithPorn',
        'ArtefactPorn'
      ])
    ]
    if (PageOptions.ShouldShowFlickr()) {
      groups.push(
        this.BuildGroup('Flickr', 'flickr', [
          'landscape',
          'architecture',
          'street photography',
          'wildlife'
        ])
      )
    }
    if (PageOptions.ShouldShowWikimedia()) {
      groups.push(
        this.BuildGroup('Wikimedia Commons', 'wikimedia-commons', [
          'aurora borealis',
          'astronomy',
          'wildlife',
          'architecture'
        ])
      )
    }
    if (PageOptions.ShouldShowMetMuseum()) {
      groups.push(
        this.BuildGroup('The Met Museum', 'met-museum', [
          'sunflower',
          'impressionism',
          'armor',
          'portrait'
        ])
      )
    }
    return groups
  }

  private static BuildRedditGroup(label: string, subreddits: readonly string[]): SourcePresetGroup {
    return this.BuildGroup(label, 'reddit', subreddits)
  }

  private static BuildGroup(label: string, kind: GallerySourceKind, values: readonly string[]): SourcePresetGroup {
    const unique = new Map<string, SourcePresetEntry>()
    for (const value of values) {
      const trimmed = value.trim()
      if (trimmed.length === 0) {
        continue
      }
      const key = `${kind}:${trimmed.toLowerCase()}`
      if (unique.has(key)) {
        continue
      }
      unique.set(key, this.CreateEntry(kind, trimmed))
    }
    return {
      label,
      entries: Array.from(unique.values())
    }
  }

  private static CreateEntry(kind: GallerySourceKind, value: string): SourcePresetEntry {
    return {
      kind,
      value
    }
  }
}
