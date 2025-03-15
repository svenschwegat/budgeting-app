import os
import sqlite3
import json

class SqliteImporter:
    def __init__(self):
        dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(dir)
        self.config = self.get_config()
        
    def get_config(self):
        # config.json contains file paths and key words, see config_template
        with open('config.json', 'r', encoding = 'utf-8') as file:
            return json.load(file)

    def write_to_db(self, data):
        file_path = self.config[0]['sqlite']['file_path'] + '\\' + self.config[0]['sqlite']['file_name']
        conn = sqlite3.connect(file_path)
        cursor = conn.cursor()

        table_name = self.config[0]['sqlite']['table_name']
        column_keys = self.config[0]['sqlite']['column_keys']
        value_keys = ', '.join(['?' for _ in column_keys.split(',')])

        counter = 0
        for row in data:
            row_tuple = (row.date, row.name, row.purpose, row.amount, row.category)
            cursor.execute(f"INSERT INTO {table_name} ({column_keys}) VALUES ({value_keys})", row_tuple)
            counter += 1

        conn.commit()
        conn.close()

        print(f"Data inserted successfully! Rows inserted: {counter}" )
        return str(counter)