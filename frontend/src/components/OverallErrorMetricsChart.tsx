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
  LabelList,

} from "recharts";

type OverallErrorMetricsChartProps = {
  results: any[];
};

export default function OverallErrorMetricsChart({

  results,

}: OverallErrorMetricsChartProps) {

  if (!results.length) {

    return null;

  }

  // =====================================
  // TOTAL METRICS
  // =====================================
  let totalSarimaRMSE = 0;
  let totalProphetRMSE = 0;

  let totalSarimaMAE = 0;
  let totalProphetMAE = 0;

  let totalSarimaMAPE = 0;
  let totalProphetMAPE = 0;

  let totalSarimaMSE = 0;
  let totalProphetMSE = 0;

  results.forEach((program) => {

    totalSarimaRMSE +=
      Number(
        program.metrics
          ?.sarima?.rmse || 0
      );

    totalProphetRMSE +=
      Number(
        program.metrics
          ?.prophet?.rmse || 0
      );

    totalSarimaMAE +=
      Number(
        program.metrics
          ?.sarima?.mae || 0
      );

    totalProphetMAE +=
      Number(
        program.metrics
          ?.prophet?.mae || 0
      );

    totalSarimaMAPE +=
      Number(
        program.metrics
          ?.sarima?.mape || 0
      );

    totalProphetMAPE +=
      Number(
        program.metrics
          ?.prophet?.mape || 0
      );

    totalSarimaMSE +=
      Number(
        program.metrics
          ?.sarima?.mse || 0
      );

    totalProphetMSE +=
      Number(
        program.metrics
          ?.prophet?.mse || 0
      );

  });

  const count =
    results.length;

  // =====================================
  // CHART DATA
  // =====================================
  const chartData = [

    {

      metric: "RMSE",

      SARIMA:
        Number(
          (
            totalSarimaRMSE /
            count
          ).toFixed(2)
        ),

      Prophet:
        Number(
          (
            totalProphetRMSE /
            count
          ).toFixed(2)
        ),

    },

    {

      metric: "MAE",

      SARIMA:
        Number(
          (
            totalSarimaMAE /
            count
          ).toFixed(2)
        ),

      Prophet:
        Number(
          (
            totalProphetMAE /
            count
          ).toFixed(2)
        ),

    },

    {

      metric: "MSE",

      SARIMA:
        Number(
          (
            totalSarimaMSE /
            count
          ).toFixed(2)
        ),

      Prophet:
        Number(
          (
            totalProphetMSE /
            count
          ).toFixed(2)
        ),

    },

    {

      metric: "MAPE",

      SARIMA:
        Number(
          (
            totalSarimaMAPE /
            count
          ).toFixed(2)
        ),

      Prophet:
        Number(
          (
            totalProphetMAPE /
            count
          ).toFixed(2)
        ),

    },

  ];

  return (

    <div className="w-full h-[500px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart

          data={chartData}

          margin={{

            top: 50,

            right: 30,

            left: 20,

            bottom: 20,

          }}

        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="metric" />

          {/* LOG SCALE */}
          <YAxis

            scale="log"

            domain={[1, "auto"]}

            allowDataOverflow

          />

          {/* TOOLTIP */}
          <Tooltip

            formatter={(value: any) =>

              Number(value)
                .toLocaleString()

            }

          />

          <Legend />

          {/* SARIMA */}
          <Bar

            dataKey="SARIMA"

            fill="#2563eb"

            radius={[8, 8, 0, 0]}

          >

            <LabelList

              dataKey="SARIMA"

              position="top"

              formatter={(value: any) =>

                Number(value)
                  .toLocaleString()

              }

            />

          </Bar>

          {/* PROPHET */}
          <Bar

            dataKey="Prophet"

            fill="#16a34a"

            radius={[8, 8, 0, 0]}

          >

            <LabelList

              dataKey="Prophet"

              position="insideTop"

              fill="#ffffff"

              formatter={(value: any) =>

                Number(value)
                  .toLocaleString()

              }

            />

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}