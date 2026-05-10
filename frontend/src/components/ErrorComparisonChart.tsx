"use client";

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,

} from "recharts";

type ErrorComparisonChartProps = {
  results: any[];
};

export default function ErrorComparisonChart({
  results,
}: ErrorComparisonChartProps) {

  if (!results.length) {
    return null;
  }

  const firstProgram =
    results[0];

  const data = [

    {
      metric: "RMSE",

      SARIMA:
        firstProgram.metrics.sarima.rmse,

      Prophet:
        firstProgram.metrics.prophet.rmse,
    },

    {
      metric: "MAE",

      SARIMA:
        firstProgram.metrics.sarima.mae,

      Prophet:
        firstProgram.metrics.prophet.mae,
    },

    {
      metric: "MSE",

      SARIMA:
        firstProgram.metrics.sarima.mse,

      Prophet:
        firstProgram.metrics.prophet.mse,
    },

    {
      metric: "MAPE",

      SARIMA:
        firstProgram.metrics.sarima.mape,

      Prophet:
        firstProgram.metrics.prophet.mape,
    },

  ];

  return (

    <div className="w-full h-[400px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="metric" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="SARIMA"
            fill="#16a34a"
            radius={[8, 8, 0, 0]}
          >

            <LabelList
              dataKey="SARIMA"
              position="top"
            />

          </Bar>

          <Bar
            dataKey="Prophet"
            fill="#ea580c"
            radius={[8, 8, 0, 0]}
          >

            <LabelList
              dataKey="Prophet"
              position="top"
            />

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}