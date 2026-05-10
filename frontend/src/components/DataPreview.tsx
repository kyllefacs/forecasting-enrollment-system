type DataPreviewProps = {
  data: any[];
};

export default function DataPreview({
  data,
}: DataPreviewProps) {

  if (!data || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-100">

            {headers.map((header) => (
              <th
                key={header}
                className="text-left px-4 py-3 border-b border-gray-200 text-gray-700 font-semibold"
              >
                {header}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {data.slice(0, 10).map((row, index) => (

            <tr
              key={index}
              className="hover:bg-gray-50"
            >

              {headers.map((header) => (

                <td
                  key={header}
                  className="px-4 py-3 border-b border-gray-100 text-gray-600"
                >
                  {String(row[header])}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

      <p className="text-sm text-gray-400 mt-4">
        Showing first 10 rows
      </p>

    </div>
  );
}