// =========================================
// FILE: src/components/OverallEnrollmentChart.tsx
// =========================================

"use client";

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,

} from "recharts";

type OverallEnrollmentChartProps = {

  results: any[];

  horizon: number;

  modelView: string;

};

export default function OverallEnrollmentChart({

  results,
  horizon,
  modelView,

}: OverallEnrollmentChartProps) {

  if (!results.length) {

    return null;

  }

  // =====================================
  // COMBINE HISTORICAL DATA
  // =====================================
  const historicalMap:
    Record<string, number> = {};

  results.forEach((program) => {

    program.historical.forEach(
      (item: any) => {

        if (
          !historicalMap[item.ds]
        ) {

          historicalMap[item.ds] = 0;

        }

        historicalMap[item.ds] +=
          Number(item.y);

      }
    );

  });

  // =====================================
  // SORT HISTORICAL
  // =====================================
  const historical = Object.keys(
    historicalMap
  )

    .sort()

    .map((date) => ({

      name: date,

      historical:
        historicalMap[date],

    }));

  // =====================================
  // TOTAL SARIMA
  // =====================================
  const sarimaTotals =
    Array(horizon).fill(0);

  results.forEach((program) => {

    program.forecast.sarima

      .slice(0, horizon)

      .forEach(
        (
          value: number,
          index: number
        ) => {

          sarimaTotals[index] +=
            Number(value);

        }
      );

  });

  // =====================================
  // TOTAL PROPHET
  // =====================================
  const prophetTotals =
    Array(horizon).fill(0);

  results.forEach((program) => {

    program.forecast.prophet

      .slice(0, horizon)

      .forEach(
        (
          value: number,
          index: number
        ) => {

          prophetTotals[index] +=
            Number(value);

        }
      );

  });

  // =====================================
  // FORECAST DATA
  // =====================================
  const forecastData =
    Array.from({
      length: horizon,
    }).map((_, index) => ({

      name: `F${index + 1}`,

      sarima:
        Math.round(
          sarimaTotals[index]
        ),

      prophet:
        Math.round(
          prophetTotals[index]
        ),

    }));

  // =====================================
  // MERGE
  // =====================================
  const chartData = [

    ...historical,

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

          {/* HISTORICAL */}
          <Line

            type="monotone"

            dataKey="historical"

            stroke="#2563eb"

            strokeWidth={4}

            name="Historical"

          />

          {/* SARIMA */}
          {(

            modelView === "sarima"

            ||

            modelView === "compare"

          ) && (

            <Line

              type="monotone"

              dataKey="sarima"

              stroke="#16a34a"

              strokeWidth={4}

              strokeDasharray="5 5"

              name="SARIMA Forecast"

            />

          )}

          {/* PROPHET */}
          {(

            modelView === "prophet"

            ||

            modelView === "compare"

          ) && (

            <Line

              type="monotone"

              dataKey="prophet"

              stroke="#ea580c"

              strokeWidth={4}

              strokeDasharray="5 5"

              name="Prophet Forecast"

            />

          )}

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
}