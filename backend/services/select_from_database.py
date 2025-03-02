import json
import sqlite3

class DatabaseSelector:
    def __init__(self):
        config = self.get_config()
        self.db_path = config[0]['sqlite']['file_path'] + '\\' + config[0]['sqlite']['file_name']

    def get_config(self):
        # config.json contains file paths and key words, see config_template
        with open('config.json', 'r', encoding = 'utf-8') as file:
            return json.load(file)
        
    def select_from_table(self, select_statement):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(select_statement)
        rows = cursor.fetchall()
        conn.close()

        result = [dict(row) for row in rows]
        return result
        