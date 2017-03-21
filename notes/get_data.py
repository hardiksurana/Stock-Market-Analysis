from pymongo import MongoClient
import pandas as pd
import os
import csv
import quandl
from datetime import datetime

auth_tok = "neKoNF_6iNUyjxyhw9mR"
quandl.ApiConfig.api_key = auth_tok

client = MongoClient()
db = client.dbms_mini_project
collection = db.stocks

with open("NSE-datasets-codes.csv") as csvfile:
    csv_data = csv.reader(csvfile, delimiter=',')
    for row in csv_data:
        if(row[2] is not null and row[3] is not null):
            data = quandl.get(row[0], collapse='weekly')
            data["Code"] = row[0]
            data["Name"] = row[1]
            data["Sector"] = row[2]
            data["Index"] = row[3]
            data["date"] = data.index
            data = data.to_dict('records')
            res = collection.insert_many(data)
            print(db.stocks.count())
