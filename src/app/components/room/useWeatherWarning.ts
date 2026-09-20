export type WeatherWarning = {
  code: string;
  name: string;
};

export type WeatherWarningArea = {
  code: string;
  name: string;
};

export type WeatherWarningResult = {
  area: WeatherWarningArea;
  warnings: WeatherWarning[];
};
type JmaAreaItem = {
  name: string;
  parent?: string;
};

type JmaAreaData = {
  offices?: Record<string, JmaAreaItem>;
  class10s?: Record<string, JmaAreaItem>;
  class15s?: Record<string, JmaAreaItem>;
  class20s?: Record<string, JmaAreaItem>;
};

export async function fetchWeatherWarnings(
  latitude: number,
  longitude: number
): Promise<WeatherWarningResult | null> {
  const area =
    await findWeatherWarningArea(
      latitude,
      longitude
    );

  if (!area) {
    console.warn(
      "現在地の警報区域を特定できませんでした",
      {
        latitude,
        longitude,
      }
    );

    return null;
  }

  console.log(
    "現在地の警報区域",
    area
  );
  const officeCode =
  await findJmaOfficeCode(
    area.code
  );

console.log(
  "現在地の気象台区域",
  officeCode
);
if (!officeCode) {
  throw new Error(
    "現在地の気象台区域を特定できませんでした"
  );
}

const warningResponse =
  await fetch(
    `https://www.jma.go.jp/bosai/warning/data/warning/${officeCode}.json`
  );

if (!warningResponse.ok) {
  throw new Error(
    "気象庁の警報データ取得に失敗しました"
  );
}

const warningData =
  await warningResponse.json();

console.log(
  "気象庁の警報データ",
  warningData
);

  return {
    area,
    warnings: [],
  };
}
async function findJmaOfficeCode(
  areaCode: string
): Promise<string | null> {
  const response = await fetch(
    "https://www.jma.go.jp/bosai/common/const/area.json"
  );

  if (!response.ok) {
    throw new Error(
      "気象庁の区域データ取得に失敗しました"
    );
  }

  const data: JmaAreaData =
    await response.json();

  let currentCode = areaCode;

  while (currentCode) {
    if (data.offices?.[currentCode]) {
      return currentCode;
    }

    const item =
      data.class20s?.[currentCode] ??
      data.class15s?.[currentCode] ??
      data.class10s?.[currentCode];

    if (!item?.parent) {
      return null;
    }

    currentCode = item.parent;
  }

  return null;
}

async function findWeatherWarningArea(
  latitude: number,
  longitude: number
): Promise<WeatherWarningArea | null> {
  const response = await fetch(
  "/weather/warning-areas-2026.geojson"
);

  if (!response.ok) {
    throw new Error(
      "警報区域データの取得に失敗しました"
    );
  }

  const geoJson = await response.json();

  const point: [number, number] = [
    longitude,
    latitude,
  ];

  for (const feature of geoJson.features) {
    if (
      feature.geometry?.type !==
      "MultiPolygon"
    ) {
      continue;
    }

    const isInside =
      feature.geometry.coordinates.some(
        (
          polygon: number[][][][]
        ) =>
          polygon.some(
            (ring: number[][][]) =>
              pointInRing(
                point,
                ring as unknown as number[][]
              )
          )
      );

    if (isInside) {
      return {
        code:
          feature.properties.regioncode,
        name:
          feature.properties.regionname,
      };
    }
  }

  return null;
}

function pointInRing(
  point: [number, number],
  ring: number[][]
): boolean {
  const [x, y] = point;

  let inside = false;

  for (
    let i = 0, j = ring.length - 1;
    i < ring.length;
    j = i++
  ) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersects =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) /
          (yj - yi) +
          xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}