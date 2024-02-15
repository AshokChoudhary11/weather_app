"use client";
import {
  CloudLightning,
  CloudSnow,
  Loader2,
  Thermometer,
  WindIcon,
} from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { IMeteoCity, IMeteoHourly } from "../../../../../../types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { useRouter } from "next/navigation";

export default function Search({
  params,
}: {
  params: { lat: string; lon: string; cityName: string };
}) {
  const cityLat = params.lat;
  const cityLon = params.lon;
  const cityName = params.cityName;
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "0");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState<IMeteoHourly | null>(null);
  const [cityData, setCityData] = React.useState<IMeteoCity | null>(null);
  const [showFahrenheit, setShowFahrenheit] = React.useState(false);

  const fetchData = useCallback(
    async (lat: string, lon: string) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${encodeURI(
            lat
          )}&longitude=${encodeURI(lon)}&appid=${
            process.env.NEXT_PUBLIC_WEATHER_API
          }&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_speed_10m_min,rain_sum,snowfall_sum&timezone=GMT${
            showFahrenheit ? "" : `&temperature_unit=fahrenheit`
          }`
        );
        const cityResponse = await fetch(`
			https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&count=10&language=en&format=json`);
        const cityData = await cityResponse.json();
        const data = await response.json();
        setData(data);
        setCityData(cityData.results[0]);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    },
    [cityName, showFahrenheit]
  );
  const router = useRouter();

  const dayCount = 7;
  const previousDisable = currentPage === 0;
  const nextDisable = currentPage + 1 >= dayCount;

  useEffect(() => {
    fetchData(cityLat, cityLon);
  }, [fetchData, cityLat, cityLon]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !nextDisable) {
        router.push(
          `/details/${cityLat}/${cityLon}/${cityName}/?page=${currentPage + 1}`
        );
      }
      if (e.key === "ArrowLeft" && !previousDisable) {
        router.push(
          `/details/${cityLat}/${cityLon}/${cityName}/?page=${currentPage - 1}`
        );
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nextDisable, previousDisable, currentPage]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center mt-4 gap-2">
        <Loader2 className="animate-spin" />
        Loading....
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }
  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center mt-4">
        No Data
      </div>
    );
  }

  const reportDate = new Date();
  reportDate.setDate(reportDate.getDate() + currentPage);
  const todayWeatherDetails = {
    code: data.daily.weather_code[currentPage],
    maxTemp: data.daily.temperature_2m_max[currentPage],
    minTemp: data.daily.temperature_2m_min[currentPage],
    maxWindSpeed: data.daily.wind_speed_10m_max[currentPage],
    minWindSpeed: data.daily.wind_speed_10m_min[currentPage],
    tempUnit: data.daily_units.temperature_2m_max,
    windUnit: data.daily_units.wind_speed_10m_max,
    rainSum: data.daily.rain_sum[currentPage],
    snowfallSum: data.daily.snowfall_sum[currentPage],
    rainSumUnit: data.daily_units.rain_sum,
    snowfallSumUnit: data.daily_units.snowfall_sum,
  };

  return (
    <div className="flex w-full gap-2 p-3 flex-col bg-zinc-800 justify-between items-center flex-grow">
      <div className="flex flex-col rounded-lg border-zinc-200 text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 border-0 bg-zinc-900 h-full w-full md:w-1/2 flex-grow">
        <div className="p-6 flex-1 pt-0 flex flex-col items-center justify-stretch h-full w-full">
          <div className="text-white flex flex-col h-full w-full flex-1">
            <div className="space-y-1.5 p-6 flex flex-col w-full h-full">
              <div className="flex">
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {cityData?.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {reportDate.toDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <Toggle
                    className="flex items-center gap-1"
                    onPressedChange={(pressed) => {
                      setShowFahrenheit(pressed);
                    }}
                  >
                    <Thermometer />
                    {showFahrenheit ? "Fahrenheit" : "Celsius"}
                  </Toggle>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center p-0 w-full">
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                  <div className="flex items-center">
                    <p className="text-6xl flex align-top">
                      {(
                        (todayWeatherDetails.maxTemp +
                          todayWeatherDetails.minTemp) /
                        2
                      ).toPrecision(2)}
                      <span className="text-4xl pb-2">
                        {todayWeatherDetails.tempUnit}
                      </span>
                    </p>
                  </div>
                  {/* <p className="capitalize">{weatherCodes[]}</p> */}
                </div>
                <div className="flex gap-4 m-4 w-full">
                  <div className="flex flex-1 flex-col justify-center items-center gap-1">
                    <WindIcon />
                    <p className="text-sm text-zinc-500">
                      {(
                        (todayWeatherDetails.maxTemp +
                          todayWeatherDetails.minTemp) /
                        2
                      ).toPrecision(2)}
                      {todayWeatherDetails.windUnit}
                    </p>
                    <p className="text-sm">Wind</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-center gap-1">
                    <CloudLightning />
                    <p className="text-sm text-zinc-500">
                      {todayWeatherDetails.rainSum}{" "}
                      {todayWeatherDetails.rainSumUnit}
                    </p>
                    <p className="text-sm">Rain</p>
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-center gap-1">
                    <CloudSnow />
                    <p className="text-sm text-zinc-500">
                      {todayWeatherDetails.snowfallSum}{" "}
                      {todayWeatherDetails.snowfallSumUnit}
                    </p>
                    <p className="text-sm">Snow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-zinc-200 text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 border-0 bg-zinc-900 w-full p-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                name="Previous Day"
                aria-disabled={previousDisable ? "true" : "false"}
                tabIndex={previousDisable ? -1 : 0}
                className={
                  previousDisable ? "pointer-events-none opacity-50" : undefined
                }
                href={`/details/${cityLat}/${cityLon}/${cityName}/?page=${
                  currentPage - 1
                }`}
              />
            </PaginationItem>
            {!previousDisable && (
              <PaginationItem>
                <PaginationLink
                  href={`/details/${cityLat}/${cityLon}/${cityName}?page=${
                    currentPage - 1
                  }`}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={`/details/${cityLat}/${cityLon}/${cityName}?page=${currentPage}`}
                isActive
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            {!nextDisable && (
              <PaginationItem>
                <PaginationLink
                  href={`/details/${cityLat}/${cityLon}/${cityName}?page=${
                    currentPage + 1
                  }`}
                >
                  {currentPage + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage + 2 < dayCount && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                name="Next Day"
                aria-disabled={nextDisable ? "true" : "false"}
                tabIndex={nextDisable ? -1 : 0}
                className={
                  nextDisable ? "pointer-events-none opacity-50" : undefined
                }
                href={`/details/${cityLat}/${cityLon}/${cityName}?page=${
                  currentPage + 1
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
