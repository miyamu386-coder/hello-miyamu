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

type JmaWarningKind = {
    code?: string;
    status: string;
};
const WEATHER_WARNING_NAMES: Record<
    string,
    string
> = {
    "00": "解除",
    "02": "暴風雪警報",
    "03": "大雨警報",
    "04": "洪水警報",
    "05": "暴風警報",
    "06": "大雪警報",
    "07": "波浪警報",
    "08": "高潮警報",
    "09": "レベル3土砂災害警報",

    "10": "大雨注意報",
    "12": "大雪注意報",
    "13": "風雪注意報",
    "14": "雷注意報",
    "15": "強風注意報",
    "16": "波浪注意報",
    "17": "融雪注意報",
    "18": "洪水注意報",
    "19": "高潮注意報",
    "20": "濃霧注意報",
    "21": "乾燥注意報",
    "22": "なだれ注意報",
    "23": "低温注意報",
    "24": "霜注意報",
    "25": "着氷注意報",
    "26": "着雪注意報",
    "27": "その他の注意報",
    "29": "レベル2土砂災害注意報",

    "32": "暴風雪特別警報",
    "33": "大雨特別警報",
    "35": "暴風特別警報",
    "36": "大雪特別警報",
    "37": "波浪特別警報",
    "38": "高潮特別警報",
    "39": "レベル5土砂災害特別警報",

    "42": "予約",
    "43": "レベル4大雨危険警報",
    "45": "予約",
    "46": "予約",
    "47": "予約",
    "48": "レベル4高潮危険警報",
    "49": "レベル4土砂災害危険警報",
};

type JmaClass20Item = {
    areaCode: string;
    kinds: JmaWarningKind[];
};

type JmaWarningReport = {
    controlDatetime?: string;
    reportDatetime?: string;
    infoType?: string;
    publishingOffice?: string;
    headlineText?: string;
    warning?: {
        class20Items?: JmaClass20Item[];
    };
    dataTypeCode?: string;
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

    const response = await fetch(
        "https://www.jma.go.jp/bosai/warning/data/r8/map.json"
    );

    if (!response.ok) {
        throw new Error(
            "気象庁の警報データ取得に失敗しました"
        );
    }

    const warningData:
        JmaWarningReport[] =
        await response.json();

    const matchingReports =
        warningData.filter(
            (report) =>
                report.warning?.class20Items?.some(
                    (item) =>
                        item.areaCode === area.code
                )
        );

    console.log(
        "現在地に該当する警報データ",
        matchingReports
    );

    const latestKindsByCode =
        new Map<
            string,
            {
                kind: JmaWarningKind;
                reportDatetime: number;
            }
        >();

    for (const report of matchingReports) {
        const item =
            report.warning?.class20Items?.find(
                (item) =>
                    item.areaCode === area.code
            );

        if (!item) {
            continue;
        }

        const reportDatetime =
            report.reportDatetime
                ? new Date(
                    report.reportDatetime
                ).getTime()
                : 0;

        for (const kind of item.kinds) {
            if (!kind.code) {
                continue;
            }

            const current =
                latestKindsByCode.get(
                    kind.code
                );

            if (
                !current ||
                reportDatetime >
                current.reportDatetime
            ) {
                latestKindsByCode.set(
                    kind.code,
                    {
                        kind,
                        reportDatetime,
                    }
                );
            }
        }
    }

    const warnings: WeatherWarning[] =
        [];

    for (
        const [code, latest] of
        latestKindsByCode
    ) {
        const { kind } = latest;

        if (
            kind.status === "解除" ||
            kind.status ===
            "発表警報・注意報はなし"
        ) {
            continue;
        }

        const name =
            WEATHER_WARNING_NAMES[code];

        if (
            !name ||
            name === "解除" ||
            name === "予約"
        ) {
            continue;
        }

        warnings.push({
            code,
            name,
        });
    }

    console.log(
        "現在地で発表中の警報・注意報",
        warnings
    );

    return {
        area,
        warnings,
    };
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

    const geoJson =
        await response.json();

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