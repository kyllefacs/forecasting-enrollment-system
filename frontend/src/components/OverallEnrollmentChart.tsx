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
};

export default function OverallEnrollmentChart({
  results = [],
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
  // BUILD OVERALL DATA
  // =====================================

  const historicalTotals:
    number[] = [];

  const sarimaTotals:
    number[] = [];

  const prophetTotals:
    number[] = [];

  results.forEach(
    (item) => {

      const historical =
        item?.historical || [];

      historical.forEach(
        (
          value: number,
          index: number
        ) => {

          historicalTotals[
            index
          ] =

            (
              historicalTotals[
                index
              ] || 0
            ) + value;

        }
      );

      const sarima =
        item?.forecast
          ?.sarima || [];

      sarima.forEach(
        (
          value: number,
          index: number
        ) => {

          sarimaTotals[
            index
          ] =

            (
              sarimaTotals[
                index
              ] || 0
            ) + value;

        }
      );

      const prophet =
        item?.forecast
          ?.prophet || [];

      prophet.forEach(
        (
          value: number,
          index: number
        ) => {

          prophetTotals[
            index
          ] =

            (
              prophetTotals[
                index
              ] || 0
            ) + value;

        }
      );

    }
  );

  // =====================================
  // CREATE CHART DATA
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
          prophetTotals[
            index
          ] ?? null,

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