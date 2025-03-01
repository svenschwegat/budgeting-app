# start with fastapi dev main.py

import uvicorn
from typing import List
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from services.parse_bank_statement_pdf import PdfParser
from services.test_py import AddNumbers


class Item(BaseModel):
    name: str

class Items(BaseModel):
    items: List[Item]

app = FastAPI()

add_numbers = AddNumbers(10)

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

memory_db = {"items": []}

@app.get("/items", response_model=Items)
def get_items():
    return Items(items=memory_db["items"])

@app.post("/items")
def add_item(item: Item, response_model=Item):
    memory_db['items'].append(item)
    return item

@app.post("/parse-pdf")
async def parse_pdf(): #file: UploadFile = File(...)
    #contents = await file.read()
    #with open("temp.pdf", "wb") as f:
    #    f.write(contents)

    result = PdfParser #.parse("temp.pdf")
    
    return {"result": result}

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