    // ─────────────────────────────────────────────────────────────
    // 1. Config (hardcoded)
    // ─────────────────────────────────────────────────────────────
    const CONFIG = {
        baseUrl:      'https://api.open-meteo.com/v1/forecast',
        geocodingUrl: 'https://geocoding-api.open-meteo.com/v1/search',
        dailyVariables: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'precipitation_probability_max',
            'wind_speed_10m_max',
            'sunrise',
            'sunset'
        ],
        forecastDays: 16,
        units: {
            temperature_unit: 'celsius',
            wind_speed_unit: 'kmh',
            precipitation_unit: 'mm',
            timezone: 'auto'
        }
    };