export type ForecastRow = {
  department: string;

  program: string;

  ds: string;

  y: number;
};

export type PreparedForecastData = {
  [program: string]: ForecastRow[];
};

export function prepareForecastData(
  data: Record<string, any>[]
): PreparedForecastData {

  const groupedData: PreparedForecastData = {};

  data.forEach((row) => {

    const department =
      String(row.Department).trim();

    const program =
      String(row.Program).trim();

    const semester =
      String(row.Semester).trim();

    const year =
      String(row.Year).trim();

    const enrollment = Number(
      row["Total Enrollments"]
    );

    // Skip invalid rows
    if (
      !department ||
      !program ||
      !semester ||
      !year ||
      isNaN(enrollment)
    ) {
      return;
    }

    // Generate timeline
    const ds = `${year}-${semester}`;

    // Create bucket
    if (!groupedData[program]) {

      groupedData[program] = [];

    }

    groupedData[program].push({

      department,

      program,

      ds,

      y: enrollment,

    });

  });

  // Sort chronologically
  Object.keys(groupedData).forEach((program) => {

    groupedData[program].sort((a, b) =>
      a.ds.localeCompare(b.ds)
    );

  });

  return groupedData;
}