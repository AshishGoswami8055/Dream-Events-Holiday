import { SITE_CONFIG } from "@/constants";

const PHOTON_API = "https://photon.komoot.io/api/";
const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

const USER_AGENT = `${SITE_CONFIG.name}/1.0 (${SITE_CONFIG.email})`;

export interface PlaceSuggestion {
  placeId: string;
  label: string;
  lat: number;
  lon: number;
  embedUrl: string;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id: number;
    osm_type: string;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    extent?: [number, number, number, number];
  };
}

function formatLabel(parts: Array<string | undefined>) {
  return parts.filter((part, index, arr) => part && arr.indexOf(part) === index).join(", ");
}

export function buildOsmEmbedUrl(
  lat: number,
  lon: number,
  extent?: [number, number, number, number]
): string {
  let minLon: number;
  let minLat: number;
  let maxLon: number;
  let maxLat: number;

  if (extent) {
    [minLon, maxLat, maxLon, minLat] = extent;
  } else {
    const delta = 0.06;
    minLon = lon - delta;
    minLat = lat - delta;
    maxLon = lon + delta;
    maxLat = lat + delta;
  }

  const bbox = `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
}

async function searchWithPhoton(query: string): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: "6",
    lang: "en",
  });

  const res = await fetch(`${PHOTON_API}?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { features?: PhotonFeature[] };

  return (data.features || [])
    .map((feature) => {
      const [lon, lat] = feature.geometry.coordinates;
      const { osm_type, osm_id, name, city, state, country, extent } = feature.properties;
      const label = formatLabel([name, city, state, country]);

      if (!label) return null;

      return {
        placeId: `${osm_type}-${osm_id}`,
        label,
        lat,
        lon,
        embedUrl: buildOsmEmbedUrl(lat, lon, extent),
      };
    })
    .filter((item): item is PlaceSuggestion => item !== null);
}

async function searchWithNominatim(query: string): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query.trim(),
    format: "json",
    addressdetails: "1",
    limit: "6",
  });

  const res = await fetch(`${NOMINATIM_API}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    boundingbox?: [string, string, string, string];
  }>;

  return data.map((place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const extent = place.boundingbox
      ? ([
          parseFloat(place.boundingbox[2]),
          parseFloat(place.boundingbox[1]),
          parseFloat(place.boundingbox[3]),
          parseFloat(place.boundingbox[0]),
        ] as [number, number, number, number])
      : undefined;

    return {
      placeId: String(place.place_id),
      label: place.display_name,
      lat,
      lon,
      embedUrl: buildOsmEmbedUrl(lat, lon, extent),
    };
  });
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (query.trim().length < 2) return [];

  const photonResults = await searchWithPhoton(query);
  if (photonResults.length > 0) return photonResults;

  return searchWithNominatim(query);
}
