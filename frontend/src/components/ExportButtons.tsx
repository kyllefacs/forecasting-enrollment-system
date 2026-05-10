"use client";

import {

  exportDashboardPNG,
  exportDashboardPDF,
  exportForecastExcel,

} from "@/utils/exportUtils";

type ExportButtonsProps = {
  forecastResults?: any[];
};

export default function ExportButtons({
  forecastResults = [],
}: ExportButtonsProps) {

  return (

    <div className="flex flex-wrap gap-3">

      {/* PNG */}
      <button

        onClick={exportDashboardPNG}

        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition"

      >

        Export PNG

      </button>

      {/* PDF */}
      <button

        onClick={exportDashboardPDF}

        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-semibold transition"

      >

        Export PDF

      </button>

      {/* EXCEL */}
      <button

        onClick={() =>
          exportForecastExcel(
            forecastResults
          )
        }

        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold transition"

      >

        Export Excel

      </button>

    </div>

  );
}