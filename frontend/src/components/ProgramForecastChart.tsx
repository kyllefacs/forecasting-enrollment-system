"use client";

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,

} from "recharts";

type ProgramForecastChartProps = {
  results: any[];
};

export default function ProgramForecastChart({
  results,
}: ProgramForecastChartProps) {

  if (!results.length) {

    return null;

  }

  const chartData = results.map(
    (item) => ({

      program: item.program,

      forecast:
        item.forecast
          ?.sarima?.[0] || 0,

    })
  );

  return (

    <div className="w-full h-[500px]">

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
            left: 40,
            bottom: 20,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="program"
            width={120}
          />

          <Tooltip />

          <Bar
            dataKey="forecast"
            fill="#2563eb"
            radius={[0, 8, 8, 0]}
          >

            <LabelList
              dataKey="forecast"
              position="right"
            />

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}