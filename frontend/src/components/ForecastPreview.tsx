type ForecastPreviewProps = {
  data: {
    [program: string]: {
      ds: string;
      y: number;
    }[];
  };
};

export default function ForecastPreview({
  data,
}: ForecastPreviewProps) {

  const programs = Object.keys(data);

  if (programs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">

      {programs.map((program) => (

        <div
          key={program}
          className="border border-gray-200 rounded-2xl overflow-hidden"
        >

          {/* HEADER */}
          <div className="bg-blue-50 px-5 py-4 border-b border-gray-200">

            <h3 className="font-bold text-blue-700 text-lg">
              {program}
            </h3>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-50">

                  <th className="text-left px-4 py-3 border-b border-gray-200">
                    Semester
                  </th>

                  <th className="text-left px-4 py-3 border-b border-gray-200">
                    Enrollment
                  </th>

                </tr>

              </thead>

              <tbody>

                {data[program].map((row, index) => (

                  <tr
                    key={index}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 border-b border-gray-100">
                      {row.ds}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100">
                      {row.y}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      ))}

    </div>
  );
}