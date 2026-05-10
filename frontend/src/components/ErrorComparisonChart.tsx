"use client";

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,

} from "recharts";

type Props = {

  result?: any;

};

export default function ErrorComparisonChart({
  result,
}: Props) {

  // =====================================
  // SAFETY CHECK
  // =====================================
  if (
    !result ||
    !result.metrics
  ) {

    return (

      <div className="flex items-center justify-center h-[300px] text-gray-500">

        No error metrics available.

      </div>

    );

  }

  // =====================================
  // SAFE METRICS
  // =====================================

  const sarima =
    result.metrics?.sarima || {

      rmse: 0,
      mae: 0,
      mse: 0,
      mape: 0,

    };

  const prophet =
    result.metrics?.prophet || {

      rmse: 0,
      mae: 0,
      mse: 0,
      mape: 0,

    };

  // =====================================
  // CHART DATA
  // =====================================

  const data = [

    {
      metric: "RMSE",
      SARIMA: sarima.rmse,
      Prophet: prophet.rmse,
    },

    {
      metric: "MAE",
      SARIMA: sarima.mae,
      Prophet: prophet.mae,
    },

    {
      metric: "MSE",
      SARIMA: sarima.mse,
      Prophet: prophet.mse,
    },

    {
      metric: "MAPE",
      SARIMA: sarima.mape,
      Prophet: prophet.mape,
    },

  ];

  return (

    <div className="w-full h-[350px]">

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
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="Prophet"
            fill="#ea580c"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}