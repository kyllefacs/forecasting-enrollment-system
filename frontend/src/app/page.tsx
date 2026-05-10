// =========================================
// FILE: src/app/page.tsx
// =========================================

"use client";
import Footer from "@/components/Footer";
import OverallErrorMetricsChart
from "@/components/OverallErrorMetricsChart";
import OverallEnrollmentChart
from "@/components/OverallEnrollmentChart";
import { useMemo, useState } from "react";

import * as XLSX from "xlsx";

import { uploadDataset } from "@/utils/api";

import Card from "@/components/Card";
import UploadBox from "@/components/UploadBox";
import ExportButtons from "@/components/ExportButtons";

import ForecastTrendChart from "@/components/ForecastTrendChart";
import ErrorComparisonChart from "@/components/ErrorComparisonChart";
import ProgramForecastChart from "@/components/ProgramForecastChart";

import ValidationPanel from "@/components/ValidationPanel";

import {
  validateDataset,
} from "@/utils/validateDataset";

export default function Home() {

  // =====================================
  // STATES
  // =====================================
  const [file, setFile] =
    useState<File | null>(null);

  const [excelData, setExcelData] =
    useState<Record<string, any>[]>([]);

  const [forecastResults, setForecastResults] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState("");

  const [selectedProgram, setSelectedProgram] =
    useState("");

  const [forecastHorizon, setForecastHorizon] =
    useState(6);

  const [modelView, setModelView] =
    useState("compare");

  // =====================================
  // VALIDATION
  // =====================================
  const validation = useMemo(
    () => validateDataset(excelData),
    [excelData]
  );

  // =====================================
  // DEPARTMENTS
  // =====================================
  const departments = [

    ...new Set(

      forecastResults.map(
        (item) => item.department
      )

    ),

  ];

  // =====================================
  // FILTERED PROGRAMS
  // =====================================
  const filteredPrograms =
    forecastResults.filter(
      (item) =>
        item.department ===
        selectedDepartment
    );

  // =====================================
  // SELECTED PROGRAM
  // =====================================
  const selectedProgramData =
    forecastResults.find(
      (item) =>
        item.program === selectedProgram
    );

  // =====================================
  // ACTIVE FORECAST
  // =====================================
  const activeForecast =
    selectedProgramData

      ? modelView === "prophet"

        ? selectedProgramData
            .forecast
            .prophet[
              forecastHorizon - 1
            ]

        : selectedProgramData
            .forecast
            .sarima[
              forecastHorizon - 1
            ]

      : 0;

  // =====================================
  // BEST MODEL
  // =====================================
  const bestModel =
    selectedProgramData
      ? (
          selectedProgramData.metrics
            .sarima.rmse
          <
          selectedProgramData.metrics
            .prophet.rmse
        )
        ? "SARIMA"
        : "Prophet"
      : "";

  // =====================================
  // TREND ANALYSIS
  // =====================================
  const trendAnalysis = (() => {

    if (!selectedProgramData) {

      return {
        trend: "No Data",
        growthRate: 0,
        risk: "Unknown",
        recommendation: "",
      };

    }

    const historical =
      selectedProgramData
        .historical;

    if (historical.length < 2) {

      return {
        trend: "Insufficient Data",
        growthRate: 0,
        risk: "Unknown",
        recommendation: "",
      };

    }

    const first =
      historical[0].y;

    const last =
      historical[
        historical.length - 1
      ].y;

    const growthRate =
      (
        (
          (last - first)
          / first
        ) * 100
      );

    let trend = "Stable";

    if (growthRate > 10) {

      trend = "Increasing";

    } else if (
      growthRate < -10
    ) {

      trend = "Declining";

    }

    let risk = "Low";

    if (activeForecast > 300) {

      risk = "High";

    } else if (
      activeForecast > 150
    ) {

      risk = "Moderate";

    }

    let recommendation =
      "Current resource allocation appears sufficient.";

    if (risk === "High") {

      recommendation =
        "Recommend opening additional sections and increasing faculty allocation.";

    } else if (
      risk === "Moderate"
    ) {

      recommendation =
        "Monitor enrollment demand and prepare contingency classroom allocation.";

    }

    return {

      trend,

      growthRate:
        growthRate.toFixed(2),

      risk,

      recommendation,

    };

  })();

  // =====================================
  // SMART INSIGHT
  // =====================================
  const smartInsight = (() => {

    if (!selectedProgramData) {

      return "";

    }

    return `
Trend Analysis:
${trendAnalysis.trend}

Projected Growth:
${trendAnalysis.growthRate}%

Risk Level:
${trendAnalysis.risk}

Recommendation:
${trendAnalysis.recommendation}

${bestModel} achieved better forecasting accuracy.
`;

  })();

  // =====================================
  // MAX STUDENTS
  // =====================================
  const MAX_STUDENTS_PER_SECTION = 50;

  // =====================================
  // FILE UPLOAD
  // =====================================
  const handleFileUpload = async (
    uploadedFile: File | null
  ) => {

    setFile(uploadedFile);

    if (!uploadedFile) {

      setExcelData([]);

      setForecastResults([]);

      return;

    }

    try {

      const data =
        await uploadedFile.arrayBuffer();

      const workbook = XLSX.read(
        data,
        {
          type: "array",
        }
      );

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData =
        XLSX.utils.sheet_to_json<
          Record<string, any>
        >(
          worksheet,
          {
            defval: "",
          }
        );

      setExcelData(jsonData);

      setLoading(true);

      const response =
        await uploadDataset(
          uploadedFile
        );

     if (response.success) {

  // =====================================
  // MAP DEPARTMENTS FROM EXCEL
  // =====================================
  const enrichedResults =
    response.results.map(
      (result: any) => {

        // Find matching row
        const matchedRow =
          jsonData.find(
            (row: any) =>

              String(
                row["Program"]
              ).trim()

              ===

              String(
                result.program
              ).trim()

          );

        return {

          ...result,

          department:
            matchedRow?.[
              "Department"
            ] || "Unknown",

        };

      }
    );

  // Save results
  setForecastResults(
    enrichedResults
  );

  // Default selections
  if (
    enrichedResults.length > 0
  ) {

    setSelectedDepartment(

      enrichedResults[0]
        .department

    );

    setSelectedProgram(

      enrichedResults[0]
        .program

    );

  }

}

    } catch (error) {

      console.error(error);

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
          setFile={handleFileUpload}
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
              errors={validation.errors}
              warnings={validation.warnings}
              isValid={validation.isValid}
            />

          </Card>

        )}

        {/* FILTERS */}
        {forecastResults.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* DEPARTMENT */}
            <Card title="🏢 Department">

              <select

                value={selectedDepartment}

                onChange={(e) => {

                  const dept =
                    e.target.value;

                  setSelectedDepartment(
                    dept
                  );

                  const firstProgram =
                    forecastResults.find(
                      (item) =>
                        item.department === dept
                    );

                  if (firstProgram) {

                    setSelectedProgram(
                      firstProgram.program
                    );

                  }

                }}

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                {departments.map(
                  (dept, index) => (

                    <option
                      key={index}
                      value={dept}
                    >
                      {dept}
                    </option>

                  )
                )}

              </select>

            </Card>

            {/* PROGRAM */}
            <Card title="🎯 Program">

              <select

                value={selectedProgram}

                onChange={(e) =>
                  setSelectedProgram(
                    e.target.value
                  )
                }

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                {filteredPrograms.map(
                  (program, index) => (

                    <option
                      key={index}
                      value={program.program}
                    >
                      {program.program}
                    </option>

                  )
                )}

              </select>

            </Card>

            {/* HORIZON */}
            <Card title="⏳ Forecast Horizon">

              <select

                value={forecastHorizon}

                onChange={(e) =>
                  setForecastHorizon(
                    Number(
                      e.target.value
                    )
                  )
                }

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                <option value={1}>
                  1 Semester
                </option>

                <option value={3}>
                  3 Semesters
                </option>

                <option value={6}>
                  6 Semesters
                </option>

              </select>

            </Card>

            {/* MODEL */}
            <Card title="🧠 Model View">

              <select

                value={modelView}

                onChange={(e) =>
                  setModelView(
                    e.target.value
                  )
                }

                className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm text-gray-700"

              >

                <option value="sarima">
                  SARIMA
                </option>

                <option value="prophet">
                  Prophet
                </option>

                <option value="compare">
                  Compare Both
                </option>

              </select>

            </Card>

          </div>

        )}

        {/* FORECAST TREND */}
        <Card title="📊 Forecast Trend">

          {selectedProgramData ? (

            <ForecastTrendChart
              results={[
                selectedProgramData
              ]}
              horizon={
                forecastHorizon
              }
              modelView={
                modelView
              }
            />

          ) : (

            <div className="h-[400px] flex items-center justify-center text-gray-400">

              Upload dataset to generate chart

            </div>

          )}

        </Card>

        <Card title="🏫 Overall Enrollment Forecast">

  {forecastResults.length > 0 ? (

    <OverallEnrollmentChart

      results={
        forecastResults
      }

      horizon={
        forecastHorizon
      }

      modelView={
        modelView
      }

    />

  ) : (

    <div className="h-[450px] flex items-center justify-center text-gray-400">

      Upload dataset to generate overall forecast

    </div>

  )}

</Card>

<Card title="📉 Overall Error Metrics">

  {forecastResults.length > 0 ? (

    <OverallErrorMetricsChart
      results={
        forecastResults
      }
    />

  ) : (

    <div className="h-[450px] flex items-center justify-center text-gray-400">

      Upload dataset to generate overall metrics

    </div>

  )}

</Card>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ERROR */}
          <Card title="📉 Error Metrics Comparison">

            {selectedProgramData ? (

              <ErrorComparisonChart
                results={[
                  selectedProgramData
                ]}
              />

            ) : (

              <div className="h-[400px] flex items-center justify-center text-gray-400">

                Upload dataset first

              </div>

            )}

          </Card>

          {/* ADVANCED ANALYTICS */}
          <Card title="🧠 Advanced Analytics">

            <div className="space-y-5">

              {/* TREND */}
              <div className="bg-blue-50 rounded-2xl p-5">

                <p className="text-blue-500 text-sm">
                  Trend Analysis
                </p>

                <p className="text-4xl font-black text-blue-700">

                  {trendAnalysis.trend}

                </p>

              </div>

              {/* GROWTH */}
              <div className="bg-green-50 rounded-2xl p-5">

                <p className="text-green-500 text-sm">
                  Projected Growth
                </p>

                <p className="text-4xl font-black text-green-700">

                  {trendAnalysis.growthRate}%

                </p>

              </div>

              {/* RISK */}
              <div className="bg-red-50 rounded-2xl p-5">

                <p className="text-red-500 text-sm">
                  Risk Level
                </p>

                <p className="text-4xl font-black text-red-700">

                  {trendAnalysis.risk}

                </p>

              </div>

            </div>

          </Card>

        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* MODEL */}
          <Card title="📈 Model Evaluation">

            {selectedProgramData ? (

              <div className="space-y-4">

                <div className="bg-blue-50 rounded-2xl p-4">

                  <p className="text-blue-500 text-sm">
                    SARIMA RMSE
                  </p>

                  <p className="text-4xl font-black text-blue-700">

                    {
                      selectedProgramData
                        .metrics
                        .sarima
                        .rmse
                    }

                  </p>

                </div>

                <div className="bg-green-50 rounded-2xl p-4">

                  <p className="text-green-500 text-sm">
                    Prophet RMSE
                  </p>

                  <p className="text-4xl font-black text-green-700">

                    {
                      selectedProgramData
                        .metrics
                        .prophet
                        .rmse
                    }

                  </p>

                </div>

              </div>

            ) : (

              <div className="text-gray-400">
                Waiting for data
              </div>

            )}

          </Card>

          {/* FORECAST */}
          <Card title="📊 Forecast Result">

            {selectedProgramData ? (

              <div className="flex flex-col justify-center h-full">

                <p className="text-7xl font-black text-blue-600">

                  {Math.round(
                    activeForecast
                  )}

                </p>

                <p className="text-gray-500 mt-2">

                  {
                    modelView ===
                    "compare"

                      ? "SARIMA Forecast"

                      : `${modelView.toUpperCase()} Forecast`
                  }

                </p>

              </div>

            ) : (

              <div className="text-gray-400">
                Waiting for forecast
              </div>

            )}

          </Card>

          {/* DECISION */}
          <Card title="👥 Decision Support">

            {selectedProgramData ? (

              <div className="space-y-4">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-gray-500 text-sm">
                    Sections Needed
                  </p>

                  <p className="text-5xl font-black text-gray-800">

                    {Math.ceil(
                      activeForecast /
                      MAX_STUDENTS_PER_SECTION
                    )}

                  </p>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-gray-500 text-sm">
                    Faculty Needed
                  </p>

                  <p className="text-5xl font-black text-gray-800">

                    {Math.ceil(
                      activeForecast /
                      MAX_STUDENTS_PER_SECTION
                    )}

                  </p>

                </div>

              </div>

            ) : (

              <div className="text-gray-400">
                Waiting for forecast
              </div>

            )}

          </Card>

        </div>

        {/* PROGRAM COMPARISON */}
        <Card title="📊 Program Forecast Comparison">

          {forecastResults.length > 0 ? (

            <ProgramForecastChart
              results={forecastResults}
            />

          ) : (

            <div className="h-[300px] flex items-center justify-center text-gray-400">

              Upload dataset first

            </div>

          )}

        </Card>

        {/* SMART INSIGHT */}
        <Card title="🏆 AI Decision Insight">

          <div className="bg-gradient-to-r from-indigo-50 to-blue-100 rounded-3xl p-6">

            <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">

              {smartInsight ||
                "Upload a dataset to generate intelligent insights."}

            </p>

          </div>

        </Card>

        {/* BEST MODEL */}
        <Card title="🏆 Best Forecasting Model">

          {selectedProgramData ? (

            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl p-6">

              <h2 className="text-4xl font-black text-green-700">

                {bestModel}

              </h2>

              <p className="text-gray-700 mt-3 leading-relaxed text-lg">

                Based on RMSE evaluation,
                the

                {" "}

                <span className="font-bold">

                  {bestModel}

                </span>

                {" "}

                model achieved better
                forecasting performance
                for the selected program.

              </p>

            </div>

          ) : (

            <div className="text-gray-400">

              Upload dataset first

            </div>

          )}

        </Card>

      </div>

      <Footer />

    </main>

  );
}