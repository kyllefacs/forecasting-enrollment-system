"use client";

export default function Footer() {

  return (

    <footer className="mt-16 border-t border-gray-200 pt-8 pb-4">

      <div className="max-w-7xl mx-auto text-center space-y-2">

        <h2 className="text-lg font-bold text-gray-800">

          Enrollment Forecast Platform

        </h2>

        <p className="text-gray-500 text-sm">

          Interactive Forecasting using
          SARIMA and Prophet Algorithms

        </p>

        <p className="text-gray-400 text-sm">

          Developed by

          {" "}

          <span className="font-semibold text-blue-600">

            Kylle Daniel Faca

          </span>

        </p>

        <p className="text-gray-400 text-xs">

          © 2026 All Rights Reserved

        </p>

      </div>

    </footer>

  );

}