"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { IMeteoCity } from "../../../../types";

export default function Search({ params }: { params: { name: string } }) {
  const cityName = params.name;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState<IMeteoCity[]>([]);

  const fetchData = useCallback(async (city: string) => {
    try {
      setLoading(true);
      const res = await fetch(`
			https://geocoding-api.open-meteo.com/v1/search?name=${encodeURI(
        city
      )}&count=10&language=en&format=json`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Error fetching data");
      }
      setData(data.results || data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData(cityName);
  }, [fetchData, cityName]);

  if (loading) {
    <Loader2 className="animate-spin" />;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  return (
    <div className="flex w-full gap-2 p-3 flex-col">
      <h1 className="text-2xl my-4 font-bold">Please select a city</h1>
      {data.map((city) => (
        <Link
          key={city.name}
          className="border p-2 rounded w-full"
          href={`/details/${city.latitude}/${city.longitude}/${encodeURI(
            city.name
          )}`}
        >
          <div className="flex gap-3">
            <div>City:</div>
            {city.name}
          </div>
          <div className="flex gap-3">
            <div>Population</div>
            {city.population}
          </div>
          <div className="flex gap-3">
            <div>Country:</div>
            {city.country}
          </div>
        </Link>
      ))}
    </div>
  );
}
