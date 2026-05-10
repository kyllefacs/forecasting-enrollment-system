"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Footer from "@/components/Footer";
import Card from "@/components/Card";
import UploadBox from "@/components/UploadBox";
import ExportButtons from "@/components/ExportButtons";
import ErrorComparisonChart from "@/components/ErrorComparisonChart";
import OverallErrorMetricsChart from "@/components/OverallErrorMetricsChart";
import ValidationPanel from "@/components/ValidationPanel";

import { uploadDataset } from "@/utils/api";
import { validateDataset } from "@/utils/validateDataset";

export default function Home() {

  // =====================================
  // STATES
  // =====================================

  const [file, setFile] =
    useState<File | null>(null);

  const [excelData, setExcelData] =
    useState<Record<string, any>[]>(
      []
    );

  const [forecastResults, setForecastResults] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedDepartment,
    setSelectedDepartment
  ] = useState("");

  const [
    selectedProgram,
    setSelectedProgram
  ] = useState("");

  // =====================================
  // VALIDATION
  // =====================================

  const validation = useMemo(
    () =>
      validateDataset(
        excelData
      ),
    [excelData]
  );

  // =====================================
  // DEPARTMENT OPTIONS
  // =====================================

  const departmentOptions =
  useMemo(() => {

    if (!excelData.length) {
      return [];
    }

    // =================================
    // FIND REAL DEPARTMENT COLUMN
    // =================================
    const firstRow =
      excelData[0];

    const departmentKey =
      Object.keys(firstRow).find(
        (key) =>

          key
            .toLowerCase()
            .trim()

            ===

          "department"
      );

    if (!departmentKey) {

      console.log(
        "Department column not found"
      );

      console.log(
        Object.keys(firstRow)
      );

      return [];

    }

    return [

      ...new Set(

        excelData.map(
          (row: any) =>

            String(
              row[
                departmentKey
              ]
            ).trim()

        )

      ),

    ];

  }, [excelData]);

  // =====================================
  // PROGRAM OPTIONS
  // =====================================

 const programOptions =
  useMemo(() => {

    if (
      !excelData.length ||
      !selectedDepartment
    ) {

      return [];

    }

    const firstRow =
      excelData[0];

    const departmentKey =
      Object.keys(firstRow).find(
        (key) =>

          key
            .toLowerCase()
            .trim()

            ===

          "department"
      );

    const programKey =
      Object.keys(firstRow).find(
        (key) =>

          key
            .toLowerCase()
            .trim()

            ===

          "program"
      );

    if (
      !departmentKey ||
      !programKey
    ) {

      return [];

    }

    return [

      ...new Set(

        excelData

          .filter(
            (row: any) =>

              String(
                row[
                  departmentKey
                ]
              ).trim()

              ===

              selectedDepartment

          )

          .map(
            (row: any) =>

              String(
                row[
                  programKey
                ]
              ).trim()

          )

      ),

    ];

  }, [
    excelData,
    selectedDepartment
  ]);

  // =====================================
  // AUTO SELECT DEPARTMENT
  // =====================================

  useEffect(() => {

    if (
      departmentOptions.length > 0 &&
      !selectedDepartment
    ) {

      setSelectedDepartment(
        departmentOptions[0]
      );

    }

  }, [
    departmentOptions,
    selectedDepartment
  ]);

  // =====================================
  // AUTO SELECT PROGRAM
  // =====================================

  useEffect(() => {

    if (
      programOptions.length > 0
    ) {

      setSelectedProgram(
        programOptions[0]
      );

    }

  }, [
    selectedDepartment
  ]);

  // =====================================
  // SELECTED PROGRAM DATA
  // =====================================

  const selectedProgramData =
    forecastResults.find(
      (item) =>
        item.program ===
        selectedProgram
    );

  // =====================================
  // BEST MODEL
  // =====================================

  const bestModel =
    selectedProgramData
      ? (
          selectedProgramData
            .metrics
            .sarima
            .rmse
          <
          selectedProgramData
            .metrics
            .prophet
            .rmse
        )
        ? "SARIMA"
        : "Prophet"
      : "N/A";

  // =====================================
  // SMART INSIGHT
  // =====================================

  const smartInsight =
    selectedProgramData

      ? `
Selected Program:
${selectedProgram}

Recommended Model:
${bestModel}

SARIMA RMSE:
${selectedProgramData.metrics.sarima.rmse}

Prophet RMSE:
${selectedProgramData.metrics.prophet.rmse}

The lower RMSE indicates better forecasting performance.
`

      : "No forecast available.";

  // =====================================
  // FILE UPLOAD
  // =====================================

  const handleFileUpload =
    async (
      uploadedFile:
      File | null
    ) => {

      setFile(
        uploadedFile
      );

      if (
        !uploadedFile
      ) {

        setExcelData([]);

        setForecastResults([]);

        return;

      }

      try {

        const data =
          await uploadedFile.arrayBuffer();

        const workbook =
          XLSX.read(
            data,
            {
              type:
                "array",
            }
          );

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[
            sheetName
          ];

        const jsonData =
          XLSX.utils.sheet_to_json<
            Record<string, any>
          >(
            worksheet,
            {
              defval: "",
            }
          );

        setExcelData(
          jsonData
        );

        setLoading(true);

        const response =
          await uploadDataset(
            uploadedFile
          );

        if (
          response.success
        ) {

          setForecastResults(
            response.results
          );

        } else {

          alert(
            "Forecast generation failed."
          );

        }

      } catch (
        error
      ) {

        console.error(
          error
        );

        alert(
          "Failed to process Excel file."
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <main className="min-h-screen bg-gray-100 px-6 py-8">

      <div
        id="dashboard-content"
        className="max-w-7xl mx-auto space-y-8"
      >

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-5xl font-black text-gray-900 tracking-tight">

              Enrollment Forecast Platform

            </h1>

            <p className="text-gray-500 text-lg mt-2">

              Interactive forecasting using SARIMA and Prophet

            </p>

          </div>

          <ExportButtons
            forecastResults={
              forecastResults
            }
          />

        </div>

        {/* UPLOAD */}
        <UploadBox
          file={file}
          setFile={
            handleFileUpload
          }
        />

        {/* LOADING */}
        {loading && (

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">

            <p className="text-blue-700 font-medium">

              Generating forecasts...

            </p>

          </div>

        )}

        {/* VALIDATION */}
        {excelData.length > 0 && (

          <Card title="🛡 Dataset Validation">

            <ValidationPanel
              errors={
                validation.errors
              }
              warnings={
                validation.warnings
              }
              isValid={
                validation.isValid
              }
            />

          </Card>

        )}

        {/* FILTERS */}
        {forecastResults.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* DEPARTMENT */}
            <Card title="🏢 Department">

              <select

                value={
                  selectedDepartment
                }

                onChange={(e) =>
                  setSelectedDepartment(
                    e.target.value
                  )
                }

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                {
                  departmentOptions.map(
                    (
                      department,
                      index
                    ) => (

                      <option
                        key={index}
                        value={department}
                      >

                        {department}

                      </option>

                    )
                  )
                }

              </select>

            </Card>

            {/* PROGRAM */}
            <Card title="🎯 Program">

              <select

                value={
                  selectedProgram
                }

                onChange={(e) =>
                  setSelectedProgram(
                    e.target.value
                  )
                }

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                {
                  programOptions.map(
                    (
                      program,
                      index
                    ) => (

                      <option
                        key={index}
                        value={program}
                      >

                        {program}

                      </option>

                    )
                  )
                }

              </select>

            </Card>

          </div>

        )}

      {/* FORECAST TREND */}
<Card title="📊 Forecast Trend">

  <div className="bg-white rounded-2xl p-6">

    {
      selectedProgramData ? (

        <div className="space-y-4">

          <h2 className="text-xl font-bold text-gray-800">

            {selectedProgram}

          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-blue-50 rounded-xl p-4">

              <p className="text-sm text-gray-500">

                SARIMA Forecast

              </p>

              <p className="text-2xl font-bold text-blue-600">

                {

                  selectedProgramData
                    ?.forecast
                    ?.sarima?.[0] ?? 0

                }

              </p>

            </div>

            <div className="bg-orange-50 rounded-xl p-4">

              <p className="text-sm text-gray-500">

                Prophet Forecast

              </p>

              <p className="text-2xl font-bold text-orange-600">

                {

                  selectedProgramData
                    ?.forecast
                    ?.prophet?.[0] ?? 0

                }

              </p>

            </div>

          </div>

        </div>

      ) : (

        <div className="text-gray-400 text-center py-10">

          Upload dataset to generate forecast

        </div>

      )
    }

  </div>

</Card>

{/* PROGRAM FORECAST */}
<Card title="📈 Program Forecast Results">

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
          forecastResults.map(
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
                    item.forecast
                      ?.sarima?.[0] ?? 0
                  }

                </td>

                <td className="p-3 text-orange-600 font-semibold">

                  {
                    item.forecast
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

</Card>

{/* OVERALL ENROLLMENT */}
<Card title="🌍 Overall Enrollment Forecast">

  <div className="grid grid-cols-2 gap-6">

    <div className="bg-green-50 rounded-2xl p-6">

      <h3 className="text-lg font-semibold text-gray-700">

        Total SARIMA Forecast

      </h3>

      <p className="text-4xl font-black text-green-600 mt-4">

        {

          forecastResults.reduce(
            (
              total,
              item
            ) =>

              total +

              (
                item.forecast
                  ?.sarima?.[0] ?? 0
              ),

            0
          )

        }

      </p>

    </div>

    <div className="bg-purple-50 rounded-2xl p-6">

      <h3 className="text-lg font-semibold text-gray-700">

        Total Prophet Forecast

      </h3>

      <p className="text-4xl font-black text-purple-600 mt-4">

        {

          forecastResults.reduce(
            (
              total,
              item
            ) =>

              total +

              (
                item.forecast
                  ?.prophet?.[0] ?? 0
              ),

            0
          )

        }

      </p>

    </div>

  </div>

</Card>

{/* ERROR CHARTS */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <Card title="📉 Error Metrics Comparison">

    <ErrorComparisonChart
      result={
        selectedProgramData
      }
    />

  </Card>

  {/* SMART INSIGHT */}
  <Card title="🧠 Smart Insight">

    <div className="bg-blue-50 rounded-2xl p-6 h-full">

      <pre className="whitespace-pre-wrap text-gray-700 leading-7 font-sans">

        {smartInsight}

      </pre>

    </div>

  </Card>

</div>

{/* OVERALL ERROR */}
<Card title="📊 Overall Error Metrics">

  <OverallErrorMetricsChart
    results={forecastResults}
  />

</Card>

{/* FOOTER */}
<Footer />

      </div>

    </main>

  );

}