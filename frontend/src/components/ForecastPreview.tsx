"use client";

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,

} from "recharts";

type Props = {
  result?: any;
};

export default function ForecastPreview({
  result,
}: Props) {

  // =====================================
  // EMPTY STATE
  // =====================================

  if (!result) {

    return (

      <div className="flex items-center justify-center h-[400px] text-gray-400">

        Upload dataset to generate chart

      </div>

    );

  }

  // =====================================
  // SAFE VALUE
  // =====================================

  const safeValue = (
    value: any
  ) => {

    if (
      typeof value === "object" &&
      value !== null
    ) {

      return Number(
        value?.y ?? 0
      );

    }

    return Number(
      value ?? 0
    );

  };

  // =====================================
  // DATA
  // =====================================

  const historical =
    result?.historical || [];

  const sarimaForecast =
    result?.forecast
      ?.sarima || [];

  const prophetForecast =
    result?.forecast
      ?.prophet || [];

  // =====================================
  // BUILD HISTORICAL
  // =====================================

  const historicalData =
    historical.map(
      (
        value: any,
        index: number
      ) => ({

        name:
          `H${index + 1}`,

        Historical:
          safeValue(value),

        SARIMA:
          null,

        Prophet:
          null,

      })
    );

  // =====================================
  // BUILD FORECAST
  // =====================================

  const forecastData =
    sarimaForecast.map(
      (
        value: any,
        index: number
      ) => ({

        name:
          `F${index + 1}`,

        Historical:
          null,

        SARIMA:
          safeValue(value),

        Prophet:
          safeValue(
            prophetForecast[
              index
            ]
          ),

      })
    );

  const chartData = [

    ...historicalData,
    ...forecastData,

  ];

  return (

    <div className="w-full h-[500px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={chartData}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="Historical"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="SARIMA"
            stroke="#16a34a"
            strokeWidth={3}
            strokeDasharray="5 5"
          />

          <Line
            type="monotone"
            dataKey="Prophet"
            stroke="#ea580c"
            strokeWidth={3}
            strokeDasharray="5 5"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}