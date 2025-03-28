# start with fastapi dev main.py

import uvicorn
from typing import List, Optional
from pydantic import BaseModel

from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from services.parse_bank_statement_pdf import PdfParser
from services.parse_bank_statement_csv import CsvParser
from services.sqlite_service import SqliteService
from services.data_query_service import DataQuerier

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
    main_color: str
    main_category: str
    sub_category: str
    mapping: Optional[str]
    is_visible: int

class Transaction(BaseModel):
    key: int
    date: str
    name: str
    purpose: str
    amount: float
    category: int
    isAllowed: bool

load_dotenv(dotenv_path="../env_var/env-compose-backend.env")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global sqlite_service
    sqlite_service = SqliteService.from_env_vars()    
    
    yield
    sqlite_service.close_connection()
    print('Shutting down')

app = FastAPI(lifespan=lifespan)

pdf_parser = PdfParser()
csv_parser = CsvParser()
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
        result = sqlite_service.insert_transactions(transactions)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to write to database")

@app.get("/transactions-by-month")
async def get_transactions_by_month(start_date: str = None, end_date: str = None):
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

@app.get("/transactions-by-main-category-and-month")
async def get_transactions_by_main_category_and_month():
    sql_query = "\
        SELECT \
            strftime('%Y', tr.transaction_date) AS year, \
            strftime('%m', tr.transaction_date) AS month, \
            cat.main_category AS category, \
            SUM(tr.amount) AS total_amount \
        FROM transactions tr \
        JOIN categories cat ON tr.category_id = cat.id \
        GROUP BY year, month, cat.main_category ORDER BY year, month ASC"

    raw_data = await fetch_from_db(sql_query)
    result = data_querier.query_transactions_by_category_and_month(raw_data)
    return result

@app.get("/transactions-by-sub-category-and-month")
async def get_transactions_by_sub_category_and_month():
    sql_query = "\
        SELECT \
            strftime('%Y', tr.transaction_date) AS year, \
            strftime('%m', tr.transaction_date) AS month, \
            cat.sub_category AS category, \
			CAST(tr.category_id AS INT) AS cat_id, \
            SUM(tr.amount) AS total_amount \
        FROM transactions tr \
        JOIN categories cat ON tr.category_id = cat.id \
        GROUP BY year, month, cat.sub_category \
        ORDER BY year, month, cat_id ASC"

    raw_data = await fetch_from_db(sql_query)
    result = data_querier.query_transactions_by_category_and_month(raw_data)
    return result

@app.get("/categories", response_model=List[Category])
async def get_categories():
    result = await fetch_from_db('SELECT * FROM categories')
    return result

@app.get("/main-categories")
async def get_main_categories():
    result = await fetch_from_db('SELECT DISTINCT main_category, main_color FROM categories')
    return result

@app.get("/sub-categories")
async def get_sub_categories():
    sql_query = "\
        SELECT DISTINCT id, sub_category AS key, sub_category AS label, main_color AS sub_color, is_visible \
        FROM categories \
        UNION SELECT 0, 'date', 'Monat', '3da2f4', 1 FROM categories \
        ORDER BY id ASC"
    result = await fetch_from_db(sql_query)
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
        categories = await get_categories()
        result = pdf_parser.parse_pdf(file, categories)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")

async def fetch_from_db(sqlStatement: str):
    try:
        result = sqlite_service.select_from_db(sqlStatement)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to query data")

# rework
if(__name__ == "__init__"):
    uvicorn.run(app, host="0.0.0.0", port=8000)