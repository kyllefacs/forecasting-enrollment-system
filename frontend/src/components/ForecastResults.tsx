"use client";

type Props = {
  results?: any[];
};

export default function ForecastResults({
  results = [],
}: Props) {

  if (results.length === 0) {

    return (

      <div className="flex items-center justify-center h-[300px] text-gray-400">

        No forecast results available

      </div>

    );

  }

  return (

    <div className="overflow-auto">

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-3 text-left">

              Program

            </th>

            <th className="p-3 text-left">

              SARIMA

            </th>

            <th className="p-3 text-left">

              Prophet

            </th>

          </tr>

        </thead>

        <tbody>

          {
            results.map(
              (
                item,
                index
              ) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="p-3">

                    {item.program}

                  </td>

                  <td className="p-3 text-blue-600 font-semibold">

                    {
                      item?.forecast
                        ?.sarima?.[0] ?? 0
                    }

                  </td>

                  <td className="p-3 text-orange-600 font-semibold">

                    {
                      item?.forecast
                        ?.prophet?.[0] ?? 0
                    }

                  </td>

                </tr>

              )
            )
          }

        </tbody>

      </table>

    </div>

  );

}