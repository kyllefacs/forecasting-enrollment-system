# =========================================
# FILE: backend/forecasting.py
# =========================================

import pandas as pd
import numpy as np

from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet


# =========================================
# PREPARE PROGRAM DATA
# =========================================
def prepare_program_data(df):

    # Remove empty rows
    df = df.dropna(
        subset=[
            "Department",
            "Program",
            "Semester",
            "Year",
            "Total Enrollments"
        ]
    )

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

        # Convert semester to real month
        month = (
            "01"
            if semester == "1"
            else "06"
        )

        # Final datetime
        date = f"{year}-{month}-01"

        # Department
        department = str(
            row["Department"]
        ).strip()

        # Program
        program = str(
            row["Program"]
        ).strip()

        # Enrollment validation
        enrollment_raw = row[
            "Total Enrollments"
        ]

        if pd.isna(enrollment_raw):

            continue

        try:

            enrollment = float(
                enrollment_raw
            )

        except:

            continue

        if np.isnan(enrollment):

            continue

        # Create program bucket
        if program not in programs:

            programs[program] = {

                "department": department,

                "data": []

            }

        # Append row
        programs[program]["data"].append({

            "ds": date,

            "y": enrollment,

        })

    return programs


# =========================================
# RUN SARIMA
# =========================================
def run_sarima(series):

    try:

        values = [x["y"] for x in series]

        # Need enough observations
        if len(values) < 4:

            return []

        model = SARIMAX(

            values,

            order=(1, 1, 1),

            seasonal_order=(1, 1, 1, 2)

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
# RUN PROPHET
# =========================================
def run_prophet(series):

    try:

        prophet_df = pd.DataFrame(series)

        prophet_df["ds"] = pd.to_datetime(

            prophet_df["ds"],

            format="%Y-%m-%d",

            errors="coerce"

        )

        prophet_df = prophet_df.dropna()

        if len(prophet_df) < 4:

            return []

        model = Prophet()

        model.fit(prophet_df)

        future = model.make_future_dataframe(

            periods=6,

            freq="6ME"

        )

        forecast = model.predict(
            future
        )

        predictions = (

            forecast["yhat"]

            .tail(6)

            .tolist()

        )

        return [

            round(float(x), 2)

            for x in predictions

        ]

    except Exception as e:

        print(
            "PROPHET ERROR:",
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
        np.abs(actual - predicted)
    )

    mse = np.mean(
        (actual - predicted) ** 2
    )

    rmse = np.sqrt(mse)

    mape = np.mean(

        np.abs(

            (actual - predicted)

            /

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

    for program_name, program_info in programs.items():

        department_name = program_info[
            "department"
        ]

        series = program_info[
            "data"
        ]

        actual = [

            x["y"]

            for x in series

        ]

        # SARIMA
        sarima_forecast = run_sarima(
            series
        )

        # PROPHET
        prophet_forecast = run_prophet(
            series
        )

        # Metrics
        sarima_metrics = calculate_metrics(

            actual,

            sarima_forecast

        )

        prophet_metrics = calculate_metrics(

            actual,

            prophet_forecast

        )

        results.append({

            "department": department_name,

            "program": program_name,

            "historical": series,

            "forecast": {

                "sarima": sarima_forecast,

                "prophet": prophet_forecast,

            },

            "metrics": {

                "sarima": sarima_metrics,

                "prophet": prophet_metrics,

            }

        })

    return results