// =========================================
// FILE: src/components/ForecastTrendChart.tsx
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

type ForecastTrendChartProps = {

  results: any[];

  horizon: number;

  modelView: string;

};

export default function ForecastTrendChart({

  results,
  horizon,
  modelView,

}: ForecastTrendChartProps) {

  if (!results.length) {

    return null;

  }

  const program = results[0];

  // =====================================
  // HISTORICAL
  // =====================================
  const historical =
    program.historical.map(
      (item: any) => ({

        name: item.ds,

        historical: item.y,

      })
    );

  // =====================================
  // SARIMA
  // =====================================
  const sarima =
    program.forecast.sarima

      .slice(0, horizon)

      .map(

        (
          value: number,
          index: number
        ) => ({

          name: `F${index + 1}`,

          sarima: value,

        })

      );

  // =====================================
  // PROPHET
  // =====================================
  const prophet =
    program.forecast.prophet

      .slice(0, horizon)

      .map(

        (
          value: number,
          index: number
        ) => ({

          name: `F${index + 1}`,

          prophet: value,

        })

      );

  // =====================================
  // MERGE
  // =====================================
  const chartData = [

    ...historical,

    ...sarima.map(
      (item: any, index: number) => ({

        ...item,

        prophet:
          prophet[index]
            ?.prophet,

      })
    ),

  ];

  return (

    <div className="w-full h-[450px]">

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

            strokeWidth={3}

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

              strokeWidth={3}

              strokeDasharray="5 5"

              name="SARIMA"

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

              strokeWidth={3}

              strokeDasharray="5 5"

              name="Prophet"

            />

          )}

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
}