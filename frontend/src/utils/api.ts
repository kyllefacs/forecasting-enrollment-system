// =========================================
// FILE: src/utils/api.ts
// =========================================

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL;

// =========================================
// UPLOAD DATASET
// =========================================
export const uploadDataset =
  async (file: File) => {

    try {

      if (!API_URL) {

        throw new Error(
          "API URL is missing."
        );

      }

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

      if (!response.ok) {

        const errorData =
          await response.text();

        console.error(
          "API ERROR:",
          errorData
        );

        throw new Error(
          "Failed to upload dataset."
        );

      }

      return await response.json();

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