# start with fastapi dev main.py

import uvicorn
from typing import List, Optional
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from services.parse_bank_statement_pdf import PdfParser
from services.parse_bank_statement_csv import CsvParser
from services.select_from_database import DatabaseSelector
from services.import_json_to_sqlite import SqliteImporter
from services.custom_queries import DataQuerier
from services.test_py import AddNumbers

class Asset(BaseModel):
    id: int
    date: str
    asset1: Optional[float]
    asset2: Optional[float]
    asset3: Optional[float]
    asset4: Optional[float]
    asset5: Optional[float]

class Category(BaseModel):
    id: int
    type: str
    main_category: str
    sub_category: str
    mapping: Optional[str]

class Transaction(BaseModel):
    key: int
    date: str
    name: str
    purpose: str
    amount: float
    category: int
    isAllowed: bool

app = FastAPI()

add_numbers = AddNumbers(10)
pdf_parser = PdfParser()
csv_parser = CsvParser()
db_selector = DatabaseSelector()
db_writer = SqliteImporter()
data_querier = DataQuerier()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/assets")
async def get_assets():
    result = await fetch_from_db('SELECT * FROM assets')
    return result

@app.post("/transactions")
async def post_transactions(transactions: List[Transaction]):
    try:
        result = db_writer.write_to_db(transactions)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to write to database")

@app.get("/transactions-per-month")
async def get_transactions_per_month(start_date: str = None, end_date: str = None):
    sql_query = f"\
        SELECT SUM(tr.amount) AS total_amount, cat.main_category, cat.main_color \
        FROM transactions tr \
        JOIN categories cat ON tr.category_id = cat.id \
        WHERE tr.transaction_date >= '{start_date}' \
        AND tr.transaction_date <= '{end_date}' \
        GROUP BY main_category ORDER BY total_amount"
    raw_data = await fetch_from_db(sql_query)
    result = data_querier.query_transactions_per_month(raw_data)
    return result

@app.post("/fetch-from-db")
async def fetch_from_db(sqlStatement: str):
    try:
        print('main sql Statement', sqlStatement)
        result = db_selector.select_from_table(sqlStatement)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")

@app.get("/categories", response_model=List[Category])
async def get_categories():
    result = await fetch_from_db('SELECT * FROM categories')
    return result

@app.post("/parse-csv")
async def parse_csv(file: UploadFile = File(...)):
    try:
        categories = await get_categories()
        result = csv_parser.parse_csv(file, categories)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")
    
@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    try:
        result = pdf_parser.parse_pdf(file)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")

@app.get("/addNumbers")
async def addNumbers():
    try:
        result = add_numbers.add_two_integers(15)
        print(result)
        return JSONResponse(content={"result": result})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")


# rework
if(__name__ == "__init__"):
    uvicorn.run(app, host="0.0.0.0", port=8000)