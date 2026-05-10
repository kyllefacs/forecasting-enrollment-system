type ForecastResultsProps = {
  results: any[];
};

export default function ForecastResults({
  results,
}: ForecastResultsProps) {

  if (!results.length) {
    return null;
  }

  return (
    <div className="space-y-6">

      {results.map((program, index) => (

        <div
          key={index}
          className="border border-gray-200 rounded-3xl overflow-hidden"
        >

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">

            <h2 className="text-2xl font-bold">
              {program.program}
            </h2>

          </div>

          {/* CONTENT */}
          <div className="p-6 grid md:grid-cols-2 gap-6">

            {/* SARIMA */}
            <div className="bg-green-50 rounded-2xl p-5">

              <h3 className="font-bold text-green-700 mb-4">
                SARIMA Forecast
              </h3>

              <div className="space-y-2">

                {program.forecast.sarima.map(
                  (
                    value: number,
                    idx: number
                  ) => (

                    <div
                      key={idx}
                      className="flex justify-between"
                    >

                      <span>
                        Forecast {idx + 1}
                      </span>

                      <span className="font-bold">
                        {value}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* PROPHET */}
            <div className="bg-orange-50 rounded-2xl p-5">

              <h3 className="font-bold text-orange-700 mb-4">
                Prophet Forecast
              </h3>

              <div className="space-y-2">

                {program.forecast.prophet.map(
                  (
                    value: number,
                    idx: number
                  ) => (

                    <div
                      key={idx}
                      className="flex justify-between"
                    >

                      <span>
                        Forecast {idx + 1}
                      </span>

                      <span className="font-bold">
                        {value}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* METRICS */}
            <div className="md:col-span-2 bg-gray-50 rounded-2xl p-5">

              <h3 className="font-bold text-gray-800 mb-4">
                Model Evaluation
              </h3>

              <div className="grid md:grid-cols-2 gap-6">

                {/* SARIMA */}
                <div>

                  <h4 className="font-semibold text-green-700 mb-2">
                    SARIMA
                  </h4>

                  <div className="space-y-1 text-sm">

                    <p>
                      RMSE:
                      {" "}
                      {program.metrics.sarima.rmse}
                    </p>

                    <p>
                      MAE:
                      {" "}
                      {program.metrics.sarima.mae}
                    </p>

                    <p>
                      MSE:
                      {" "}
                      {program.metrics.sarima.mse}
                    </p>

                    <p>
                      MAPE:
                      {" "}
                      {program.metrics.sarima.mape}%
                    </p>

                  </div>

                </div>

                {/* PROPHET */}
                <div>

                  <h4 className="font-semibold text-orange-700 mb-2">
                    Prophet
                  </h4>

                  <div className="space-y-1 text-sm">

                    <p>
                      RMSE:
                      {" "}
                      {program.metrics.prophet.rmse}
                    </p>

                    <p>
                      MAE:
                      {" "}
                      {program.metrics.prophet.mae}
                    </p>

                    <p>
                      MSE:
                      {" "}
                      {program.metrics.prophet.mse}
                    </p>

                    <p>
                      MAPE:
                      {" "}
                      {program.metrics.prophet.mape}%
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}