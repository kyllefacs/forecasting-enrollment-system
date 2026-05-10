"use client";

import { useCallback } from "react";

import { useDropzone } from "react-dropzone";

import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

type UploadBoxProps = {
  file: File | null;

  setFile: (
    file: File | null
  ) => void;
};

export default function UploadBox({
  file,
  setFile,
}: UploadBoxProps) {

  // Handle Drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {

      const uploadedFile =
        acceptedFiles[0];

      if (!uploadedFile) return;

      // Allowed Excel Types
      const validTypes = [

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "application/vnd.ms-excel",

      ];

      if (
        !validTypes.includes(
          uploadedFile.type
        )
      ) {

        alert(
          "Please upload a valid Excel file."
        );

        return;
      }

      setFile(uploadedFile);

    },
    [setFile]
  );

  // Dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({

    onDrop,

    multiple: false,

    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        [".xlsx"],

      "application/vnd.ms-excel":
        [".xls"],
    },

  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all

      ${
        isDragActive
          ? "border-blue-500 bg-blue-100"
          : "border-blue-300 bg-blue-50 hover:bg-blue-100"
      }
      `}
    >

      {/* Hidden Input */}
      <input {...getInputProps()} />

      {/* EMPTY STATE */}
      {!file && (

        <div>

          <div className="flex justify-center mb-4">

            <Upload className="w-16 h-16 text-blue-500" />

          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Upload Excel Dataset
          </h2>

          <p className="text-gray-500 mt-2">
            Drag & drop your Excel file here
          </p>

          <p className="text-sm text-gray-400 mt-4">
            or click anywhere inside this box
          </p>

        </div>

      )}

      {/* FILE UPLOADED */}
      {file && (

        <div className="flex flex-col items-center">

          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />

          <h2 className="text-2xl font-bold text-gray-800">
            File Uploaded Successfully
          </h2>

          <div className="mt-4 bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-200">

            <FileSpreadsheet className="w-8 h-8 text-green-600" />

            <div className="text-left">

              <p className="font-semibold text-gray-800">
                {file.name}
              </p>

              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={(e) => {

              e.stopPropagation();

              setFile(null);

            }}
            className="mt-6 text-red-500 hover:text-red-700 font-medium"
          >
            Remove File
          </button>

        </div>

      )}

    </div>
  );
}