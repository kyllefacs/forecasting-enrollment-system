# =========================================
# FILE: backend/main.py
# FULLY FIXED VERSION
# =========================================

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

from forecasting import generate_forecasts

# =========================================
# FASTAPI APP
# =========================================
app = FastAPI()

# =========================================
# CORS FIX
# =========================================
app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# =========================================
# ROOT
# =========================================
@app.get("/")
def root():

    return {
        "message": "Backend is running."
    }

# =========================================
# UPLOAD ENDPOINT
# =========================================
@app.post("/upload")
async def upload_dataset(

    file: UploadFile = File(...)

):

    try:

        # READ EXCEL
        df = pd.read_excel(
            file.file
        )

        # GENERATE FORECAST
        results = generate_forecasts(df)

        return {

            "success": True,

            "results": results,

        }

    except Exception as e:

        print("UPLOAD ERROR:", e)

        return {

            "success": False,

            "error": str(e),

            "results": [],

        }