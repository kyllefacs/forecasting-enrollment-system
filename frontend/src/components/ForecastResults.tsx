"use client";

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,

} from "recharts";

type Props = {
  results?: any[];
};

export default function ForecastResults({
  results = [],
}: Props) {

  // =====================================
  // EMPTY STATE
  // =====================================

  if (results.length === 0) {

    return (

      <div className="flex items-center justify-center h-[400px] text-gray-400">

        No forecast data available

      </div>

    );

  }

  // =====================================
  // FORMAT DATA
  // =====================================

  const chartData =
    results.map(
      (item) => ({

        program:
          item.program,

        SARIMA:
          Number(

            item?.forecast
              ?.sarima?.[0] ?? 0

          ),

        Prophet:
          Number(

            item?.forecast
              ?.prophet?.[0] ?? 0

          ),

      })
    );

  return (

    <div className="w-full h-[600px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 20,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis type="number" />

          <YAxis
            dataKey="program"
            type="category"
            width={120}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="SARIMA"
            fill="#2563eb"
            radius={[0, 6, 6, 0]}
          />

          <Bar
            dataKey="Prophet"
            fill="#ea580c"
            radius={[0, 6, 6, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}