"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import UploadBox from "@/components/UploadBox";
import ExportButtons from "@/components/ExportButtons";

import ForecastPreview from "@/components/ForecastPreview";
import ForecastResults from "@/components/ForecastResults";
import OverallEnrollmentChart from "@/components/OverallEnrollmentChart";
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
    useState<any[]>([]);

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
  // FIND REAL COLUMN KEYS
  // =====================================

  const departmentKey =
    useMemo(() => {

      if (!excelData.length) {
        return null;
      }

      return Object.keys(
        excelData[0]
      ).find(
        (key) =>

          key
            .toLowerCase()
            .trim()

            ===

          "department"
      );

    }, [excelData]);

  const programKey =
    useMemo(() => {

      if (!excelData.length) {
        return null;
      }

      return Object.keys(
        excelData[0]
      ).find(
        (key) =>

          key
            .toLowerCase()
            .trim()

            ===

          "program"
      );

    }, [excelData]);

  // =====================================
  // DEPARTMENT OPTIONS
  // =====================================

  const departmentOptions =
    useMemo(() => {

      if (
        !excelData.length ||
        !departmentKey
      ) {

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

    }, [
      excelData,
      departmentKey
    ]);

  // =====================================
  // PROGRAM OPTIONS
  // =====================================

  const programOptions =
    useMemo(() => {

      if (
        !excelData.length ||
        !selectedDepartment ||
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
      selectedDepartment,
      departmentKey,
      programKey
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
    selectedDepartment,
    programOptions
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
            ?.metrics
            ?.sarima
            ?.rmse

          <

          selectedProgramData
            ?.metrics
            ?.prophet
            ?.rmse
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
${selectedProgramData?.metrics?.sarima?.rmse?.toFixed(2)}

Prophet RMSE:
${selectedProgramData?.metrics?.prophet?.rmse?.toFixed(2)}

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

        // =====================================
        // READ EXCEL
        // =====================================

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
          XLSX.utils.sheet_to_json(
            worksheet,
            {
              defval: "",
            }
          );

        setExcelData(
          jsonData
        );

        // =====================================
        // FORECAST API
        // =====================================

        setLoading(true);

        const response =
          await uploadDataset(
            uploadedFile
          );

        if (
          response?.success
        ) {

          setForecastResults(
            response.results || []
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
          "UPLOAD ERROR:",
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

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-5xl font-black text-gray-900">

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white"

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

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white"

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

            {/* FORECAST HORIZON */}
            <Card title="⏳ Forecast Horizon">

              <select
                className="w-full p-4 rounded-2xl border border-gray-300 bg-white"
              >

                <option>

                  6 Semesters

                </option>

              </select>

            </Card>

          </div>

        )}

        {/* FORECAST TREND */}
        <Card title="📊 Forecast Trend">

          <ForecastPreview
            result={selectedProgramData}
          />

        </Card>

        {/* OVERALL ENROLLMENT */}
        <Card title="🌍 Overall Enrollment Forecast">

          <OverallEnrollmentChart
            results={forecastResults}
          />

        </Card>

        {/* OVERALL ERROR METRICS */}
        <Card title="📉 Overall Error Metrics">

          <OverallErrorMetricsChart
            results={forecastResults}
          />

        </Card>

        {/* ERROR + ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">

            <Card title="📉 Error Metrics Comparison">

              <ErrorComparisonChart
                result={selectedProgramData}
              />

            </Card>

          </div>

          {/* ANALYTICS */}
          <Card title="🧠 Advanced Analytics">

            <div className="space-y-4">

              <div className="bg-blue-50 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Trend Analysis

                </p>

                <h2 className="text-3xl font-black text-blue-600">

                  Stable

                </h2>

              </div>

              <div className="bg-green-50 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Projected Growth

                </p>

                <h2 className="text-3xl font-black text-green-600">

                  0.00%

                </h2>

              </div>

              <div className="bg-red-50 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Risk Level

                </p>

                <h2 className="text-3xl font-black text-red-600">

                  Low

                </h2>

              </div>

            </div>

          </Card>

        </div>

        {/* MODEL EVALUATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card title="📈 Model Evaluation">

            <div className="space-y-4">

              <div className="bg-blue-50 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  SARIMA RMSE

                </p>

                <h2 className="text-4xl font-black text-blue-600">

                  {
                    selectedProgramData
                      ?.metrics
                      ?.sarima
                      ?.rmse
                      ?.toFixed(2) ?? "0.00"
                  }

                </h2>

              </div>

              <div className="bg-green-50 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Prophet RMSE

                </p>

                <h2 className="text-4xl font-black text-green-600">

                  {
                    selectedProgramData
                      ?.metrics
                      ?.prophet
                      ?.rmse
                      ?.toFixed(2) ?? "0.00"
                  }

                </h2>

              </div>

            </div>

          </Card>

          {/* FORECAST RESULT */}
          <Card title="📊 Forecast Result">

            <div className="bg-gray-50 rounded-2xl p-4">

              <h2 className="text-5xl font-black text-blue-600">

                {
                  selectedProgramData
                    ?.forecast
                    ?.sarima?.[0] ?? 0
                }

              </h2>

              <p className="text-gray-500 mt-2">

                SARIMA Forecast

              </p>

            </div>

          </Card>

          {/* DECISION SUPPORT */}
          <Card title="🧠 Decision Support">

            <div className="space-y-4">

              <div className="bg-gray-50 rounded-2xl p-4">

                <h2 className="text-5xl font-black text-gray-800">

                  1

                </h2>

                <p className="text-gray-500 mt-2">

                  Sections Needed

                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-4">

                <h2 className="text-5xl font-black text-gray-800">

                  1

                </h2>

                <p className="text-gray-500 mt-2">

                  Faculty Needed

                </p>

              </div>

            </div>

          </Card>

        </div>

        {/* PROGRAM FORECAST */}
        <Card title="📊 Program Forecast Comparison">

          <ForecastResults
            results={forecastResults}
          />

        </Card>

        {/* AI DECISION */}
        <Card title="⚠️ AI Decision Insight">

          <div className="bg-slate-100 rounded-2xl p-6">

            <pre className="whitespace-pre-wrap text-gray-700 leading-8 font-sans">

              {smartInsight}

            </pre>

          </div>

        </Card>

        {/* BEST MODEL */}
        <Card title="🏆 Best Forecasting Model">

          <div className="bg-green-50 rounded-2xl p-6">

            <h2 className="text-5xl font-black text-green-700">

              {bestModel}

            </h2>

            <p className="text-gray-600 mt-4">

              Based on RMSE evaluation,
              the {bestModel} model achieved
              better forecasting performance
              for the selected program.

            </p>

          </div>

        </Card>

        {/* FOOTER */}
        <Footer />

      </div>

    </main>

  );

}