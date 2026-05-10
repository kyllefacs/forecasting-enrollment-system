// =========================================
// FILE: frontend/src/utils/api.ts
// FULLY FIXED VERSION
// =========================================

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

// =========================================
// UPLOAD DATASET
// =========================================
export const uploadDataset =
  async (file: File) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(

          `${API_URL}/upload`,

          {

            method: "POST",

            body: formData,

          }

        );

      // HANDLE API ERRORS
      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "API ERROR:",
          errorText
        );

        throw new Error(
          "Failed to upload dataset."
        );

      }

      const data =
        await response.json();

      return data;

    } catch (error) {

      console.error(
        "UPLOAD DATASET ERROR:",
        error
      );

      return {

        success: false,

        results: [],

      };

    }

};