"use client";

type Props = {
  result?: any;
};

export default function ForecastPreview({
  result,
}: Props) {

  if (!result) {

    return (

      <div className="flex items-center justify-center h-[300px] text-gray-400">

        Upload dataset to generate forecast

      </div>

    );

  }

  const sarima =
    result?.forecast?.sarima?.[0] ?? 0;

  const prophet =
    result?.forecast?.prophet?.[0] ?? 0;

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-blue-50 rounded-2xl p-6">

        <h3 className="text-lg font-semibold text-gray-700">

          SARIMA Forecast

        </h3>

        <p className="text-4xl font-black text-blue-600 mt-4">

          {sarima}

        </p>

      </div>

      <div className="bg-orange-50 rounded-2xl p-6">

        <h3 className="text-lg font-semibold text-gray-700">

          Prophet Forecast

        </h3>

        <p className="text-4xl font-black text-orange-600 mt-4">

          {prophet}

        </p>

      </div>

    </div>

  );

}