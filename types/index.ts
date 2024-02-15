// write type for the above json

export interface IMeteoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin3_id: number;
  admin4_id: number;
  timezone: string;
  population: number;
  postcodes: string[];
  country_id: number;
  country: string;
  admin1: string;
  admin3: string;
  admin4: string;
}

export interface IMeteoHourly {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  daily: {
    weather_code: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
    wind_speed_10m_min: number[];
    rain_sum: number[];
    snowfall_sum: number[];
  };
  daily_units: {
      temperature_2m_max: string;
      temperature_2m_min: string;
      time: string;
      weather_code: string;
      wind_speed_10m_max: string;
      wind_speed_10m_min: string;
      rain_sum: string;
      snowfall_sum: string;
  };

}
