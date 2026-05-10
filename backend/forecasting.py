# =========================================
# FILE: backend/forecasting.py
# DEPLOYMENT-OPTIMIZED VERSION
# =========================================

import pandas as pd
import numpy as np

from statsmodels.tsa.statespace.sarimax import SARIMAX

# =========================================
# PREPARE PROGRAM DATA
# =========================================
def prepare_program_data(df):

    programs = {}

    for _, row in df.iterrows():

        # Semester
        semester = str(
            row["Semester"]
        ).strip()

        # Year
        year = str(
            row["Year"]
        ).strip()

        # Convert semester to month
        month = (
            "01"
            if semester == "1"
            else "06"
        )

        # Create date
        date = (
            f"{year}-{month}-01"
        )

        # Program
        program = str(
            row["Program"]
        ).strip()

        # Enrollment
        enrollment = float(
            row["Total Enrollments"]
        )

        # Initialize program
        if program not in programs:

            programs[program] = []

        # Append record
        programs[program].append({

            "ds": date,

            "y": enrollment,

        })

    return programs


# =========================================
# RUN SARIMA
# =========================================
def run_sarima(series):

    try:

        values = [
            x["y"]
            for x in series
        ]

        # Small dataset protection
        if len(values) < 4:

            return []

        model = SARIMAX(

            values,

            order=(1, 1, 1),

            seasonal_order=(
                1,
                1,
                1,
                2
            ),

            enforce_stationarity=False,

            enforce_invertibility=False,

        )

        result = model.fit(
            disp=False
        )

        forecast = result.forecast(
            steps=6
        )

        return [

            round(float(x), 2)

            for x in forecast

        ]

    except Exception as e:

        print(
            "SARIMA ERROR:",
            e
        )

        return []


# =========================================
# METRICS
# =========================================
def calculate_metrics(
    actual,
    predicted
):

    if (
        len(actual) == 0
        or
        len(predicted) == 0
    ):

        return {

            "rmse": 0,

            "mae": 0,

            "mse": 0,

            "mape": 0,

        }

    # Safe matching
    min_len = min(
        len(actual),
        len(predicted)
    )

    actual = np.array(
        actual[-min_len:]
    )

    predicted = np.array(
        predicted[-min_len:]
    )

    mae = np.mean(
        np.abs(
            actual - predicted
        )
    )

    mse = np.mean(
        (
            actual - predicted
        ) ** 2
    )

    rmse = np.sqrt(mse)

    mape = np.mean(

        np.abs(

            (
                actual - predicted
            ) /

            np.where(
                actual == 0,
                1,
                actual
            )

        )

    ) * 100

    return {

        "rmse": round(
            float(rmse),
            2
        ),

        "mae": round(
            float(mae),
            2
        ),

        "mse": round(
            float(mse),
            2
        ),

        "mape": round(
            float(mape),
            2
        ),

    }


# =========================================
# MAIN FORECAST PIPELINE
# =========================================
def generate_forecasts(df):

    programs = prepare_program_data(
        df
    )

    results = []

    for (
        program_name,
        series
    ) in programs.items():

        # Historical values
        actual = [

            x["y"]

            for x in series

        ]

        # =================================
        # SARIMA ONLY
        # =================================
        sarima_forecast = run_sarima(
            series
        )

        # =================================
        # PROPHET DISABLED
        # =================================
        prophet_forecast = []

        # =================================
        # SARIMA METRICS
        # =================================
        sarima_metrics = (
            calculate_metrics(

                actual,

                sarima_forecast

            )
        )

        # =================================
        # PROPHET METRICS
        # =================================
        prophet_metrics = {

            "rmse": 0,

            "mae": 0,

            "mse": 0,

            "mape": 0,

        }

        # =================================
        # RESULT
        # =================================
        results.append({

            "program":
                program_name,

            "historical":
                series,

            "forecast": {

                "sarima":
                    sarima_forecast,

                "prophet":
                    prophet_forecast,

            },

            "metrics": {

                "sarima":
                    sarima_metrics,

                "prophet":
                    prophet_metrics,

            }

        })

    return results