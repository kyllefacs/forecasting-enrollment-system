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
  results?: any[];
  forecastHorizon?: number;
};

export default function OverallEnrollmentChart({

  results = [],
  forecastHorizon = 6,

}: Props) {

  // =====================================
  // EMPTY STATE
  // =====================================

  if (results.length === 0) {

    return (

      <div className="flex items-center justify-center h-[500px] text-gray-400">

        No enrollment data available

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
  // TOTAL ARRAYS
  // =====================================

  const historicalTotals:
    number[] = [];

  const sarimaTotals:
    number[] = [];

  const prophetTotals:
    number[] = [];

  // =====================================
  // PROCESS RESULTS
  // =====================================

  results.forEach(
    (item) => {

      // HISTORICAL

      const historical =
        item?.historical || [];

      historical.forEach(
        (
          value: any,
          index: number
        ) => {

          historicalTotals[index] =

            (
              historicalTotals[index] || 0
            )

            +

            safeValue(value);

        }
      );

      // SARIMA

      const sarima =
        (
          item?.forecast
            ?.sarima || []
        ).slice(
          0,
          forecastHorizon
        );

      sarima.forEach(
        (
          value: any,
          index: number
        ) => {

          sarimaTotals[index] =

            (
              sarimaTotals[index] || 0
            )

            +

            safeValue(value);

        }
      );

      // PROPHET

      const prophet =
        (
          item?.forecast
            ?.prophet || []
        ).slice(
          0,
          forecastHorizon
        );

      prophet.forEach(
        (
          value: any,
          index: number
        ) => {

          prophetTotals[index] =

            (
              prophetTotals[index] || 0
            )

            +

            safeValue(value);

        }
      );

    }
  );

  // =====================================
  // HISTORICAL DATA
  // =====================================

  const historicalData =
    historicalTotals.map(
      (
        value,
        index
      ) => ({

        name:
          `H${index + 1}`,

        Historical:
          value,

        SARIMA:
          null,

        Prophet:
          null,

      })
    );

  // =====================================
  // FORECAST DATA
  // =====================================

  const forecastData =
    sarimaTotals.map(
      (
        value,
        index
      ) => ({

        name:
          `F${index + 1}`,

        Historical:
          null,

        SARIMA:
          value,

        Prophet:
          prophetTotals[index] ?? null,

      })
    );

  // =====================================
  // FINAL CHART DATA
  // =====================================

  const chartData = [

    ...historicalData,
    ...forecastData,

  ];

  // =====================================
  // RENDER
  // =====================================

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