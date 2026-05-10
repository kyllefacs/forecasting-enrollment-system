import jsPDF from "jspdf";

import * as htmlToImage from "html-to-image";

import * as XLSX from "xlsx";


// =====================================
// EXPORT PNG
// =====================================
export const exportDashboardPNG =
  async () => {

    try {

      const element =
        document.getElementById(
          "dashboard-content"
        );

      if (!element) {

        alert(
          "Dashboard not found."
        );

        return;

      }

      const dataUrl =
        await htmlToImage.toPng(
          element,
          {
            cacheBust: true,
            pixelRatio: 2,
          }
        );

      const link =
        document.createElement(
          "a"
        );

      link.download =
        "forecast-dashboard.png";

      link.href = dataUrl;

      link.click();

    } catch (error) {

      console.error(
        "PNG Export Error:",
        error
      );

      alert(
        "Failed to export PNG."
      );

    }

};

// =====================================
// EXPORT PDF
// =====================================


export const exportDashboardPDF =
  async () => {

    try {

      const element =
        document.getElementById(
          "dashboard-content"
        );

      if (!element) {

        alert(
          "Dashboard not found."
        );

        return;

      }

      // Capture dashboard
      const dataUrl =
        await htmlToImage.toPng(
          element,
          {
            cacheBust: true,

            pixelRatio: 2,

            backgroundColor:
              "#ffffff",
          }
        );

      // Create image
      const img = new Image();

      img.src = dataUrl;

      img.onload = () => {

        const pdf =
          new jsPDF(
            "p",
            "mm",
            "a4"
          );

        const pdfWidth = 210;

        const pdfHeight = 297;

        // Image dimensions
        const imgWidth =
          img.width;

        const imgHeight =
          img.height;

        // Scale image
        const ratio =
          imgWidth / pdfWidth;

        const scaledHeight =
          imgHeight / ratio;

        let heightLeft =
          scaledHeight;

        let position = 0;

        // First page
        pdf.addImage(

          dataUrl,

          "PNG",

          0,

          position,

          pdfWidth,

          scaledHeight

        );

        heightLeft -= pdfHeight;

        // Additional pages
        while (
          heightLeft > 0
        ) {

          position =
            heightLeft -
            scaledHeight;

          pdf.addPage();

          pdf.addImage(

            dataUrl,

            "PNG",

            0,

            position,

            pdfWidth,

            scaledHeight

          );

          heightLeft -=
            pdfHeight;

        }

        // Save PDF
        pdf.save(
          "forecast-report.pdf"
        );

      };

    } catch (error) {

      console.error(
        "PDF Export Error:",
        error
      );

      alert(
        "Failed to export PDF."
      );

    }

};

// =====================================
// EXPORT EXCEL
// =====================================
export const exportForecastExcel = (
  forecastResults: any[]
) => {

  try {

    if (!forecastResults.length) {

      alert(
        "No forecast data available."
      );

      return;

    }

    const rows =
      forecastResults.map(
        (item) => ({

          Department:
            item.department,

          Program:
            item.program,

          Forecast:
            item.forecast
              ?.sarima?.[0] || 0,

          SARIMA_RMSE:
            item.metrics
              ?.sarima?.rmse || 0,

          Prophet_RMSE:
            item.metrics
              ?.prophet?.rmse || 0,

          Best_Model:
            item.metrics
              ?.sarima?.rmse
            <
            item.metrics
              ?.prophet?.rmse
              ? "SARIMA"
              : "Prophet",

        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Forecast Results"

    );

    XLSX.writeFile(

      workbook,

      "forecast-results.xlsx"

    );

  } catch (error) {

    console.error(
      "Excel Export Error:",
      error
    );

    alert(
      "Failed to export Excel."
    );

  }

};