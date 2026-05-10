export type ValidationResult = {
  isValid: boolean;

  errors: string[];

  warnings: string[];
};

export function validateDataset(
  data: Record<string, any>[]
): ValidationResult {

  const errors: string[] = [];

  const warnings: string[] = [];

  // Empty dataset
  if (!data || data.length === 0) {

    errors.push("Dataset is empty.");

    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // REQUIRED COLUMNS
  const requiredColumns = [
    "Department",
    "Program",
    "Semester",
    "Year",
    "Total Enrollments",
  ];

  const datasetColumns =
    Object.keys(data[0]);

  // Check columns
  requiredColumns.forEach((column) => {

    if (!datasetColumns.includes(column)) {

      errors.push(
        `Missing required column: ${column}`
      );

    }

  });

  // Validate rows
  data.forEach((row, index) => {

    // Department
    if (!row.Department) {

      warnings.push(
        `Row ${index + 1}: Missing Department`
      );

    }

    // Program
    if (!row.Program) {

      warnings.push(
        `Row ${index + 1}: Missing Program`
      );

    }

    // Semester
    if (
      row.Semester === "" ||
      row.Semester === null
    ) {

      warnings.push(
        `Row ${index + 1}: Missing Semester`
      );

    }

    // Year
    if (
      row.Year === "" ||
      row.Year === null ||
      isNaN(Number(row.Year))
    ) {

      warnings.push(
        `Row ${index + 1}: Invalid Year`
      );

    }

    // Total Enrollments
    if (
      row["Total Enrollments"] === "" ||
      row["Total Enrollments"] === null ||
      isNaN(
        Number(row["Total Enrollments"])
      )
    ) {

      warnings.push(
        `Row ${index + 1}: Invalid Total Enrollments`
      );

    }

  });

  // Forecast readiness
  if (data.length < 6) {

    warnings.push(
      "Dataset may be too small for accurate forecasting."
    );

  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}