"use client";

type Props = {
  results?: any[];
};

export default function OverallEnrollmentChart({
  results = [],
}: Props) {

  if (results.length === 0) {

    return (

      <div className="flex items-center justify-center h-[300px] text-gray-400">

        No enrollment data available

      </div>

    );

  }

  const totalSarima =
    results.reduce(
      (
        sum,
        item
      ) =>

        sum +

        (
          item?.forecast
            ?.sarima?.[0] ?? 0
        ),

      0
    );

  const totalProphet =
    results.reduce(
      (
        sum,
        item
      ) =>

        sum +

        (
          item?.forecast
            ?.prophet?.[0] ?? 0
        ),

      0
    );

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-green-50 rounded-2xl p-6">

        <h3 className="text-lg font-semibold text-gray-700">

          Total SARIMA Forecast

        </h3>

        <p className="text-4xl font-black text-green-600 mt-4">

          {totalSarima}

        </p>

      </div>

      <div className="bg-purple-50 rounded-2xl p-6">

        <h3 className="text-lg font-semibold text-gray-700">

          Total Prophet Forecast

        </h3>

        <p className="text-4xl font-black text-purple-600 mt-4">

          {totalProphet}

        </p>

      </div>

    </div>

  );

}