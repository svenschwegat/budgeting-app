from datetime import datetime
import re
import os
import csv

class CsvParser:
    def __init__(self):
        print('Csv Parser initialized')
    
    def parse_csv(self, file, categories):
        rows = self.get_rows_from_csv(file)
        json_list = self.extract_data(rows, categories)
        self.delete_temp_file(file)
        return json_list

    def get_rows_from_csv(self, file):
        contents = file.file.read()
        with open(file.filename, 'wb') as file_object:
            file_object.write(contents)

        with open(file.filename, 'r', encoding='utf-8') as file_object:
            csv_reader = csv.reader(file_object, delimiter=';')
            rows = list(csv_reader)

        return rows

    def extract_data(self, rows, categories):
        json_list = []
        category_not_found = 0
        key = 0
        date_pattern = r'^\d{2}\.(\d{2})\.(\d{2})'

        for row in rows:
            if len(row) == 0:
                continue

            date = row[0].replace('"', '')
            found_date = re.search(date_pattern, date)  
            match_date = re.match(date_pattern, date)
            if found_date == None and match_date == None:
                continue

            if found_date and len(row) == 12:
                name = row[4].strip().replace('"', '')
                purpose = row[5].strip().replace('"', '')
                amount = float(row[8].replace('.', '').replace(',', '.').replace('"', ''))

                # Extract date
                date_match = re.search(date_pattern, date)
                if date_match:
                    raw_date = date_match.group()
                    date = datetime.strptime(raw_date, '%d.%m.%y').strftime('%Y-%m-%d')
                else:
                    date = None
                    print('Date not found @ ' + row)

                category, category_not_found = self.get_category(categories, category_not_found, name, purpose)
                key += 1
                json_item = {
                    "key": key,
                    "date": date,
                    "name": name,
                    "purpose": purpose,
                    "amount": amount,
                    "category": category,
                    "isAllowed": True
                }
                json_list.append(json_item)

        if category_not_found > 0:
            print('Categories not found:', category_not_found, 'out of', len(json_list))
        else: 
            print('All categories found for', len(json_list), 'items')
        return json_list

    def get_category(self, categories, category_not_found, name, purpose):
        for category in categories:
            if category['mapping'] != None:
                mappings = category['mapping'].split(';')
            else:
                mappings = []

            if any(mapping.strip().lower() in purpose.lower() for mapping in mappings):
                category = category['id']
                break
            elif any(mapping.strip().lower() in name.lower() for mapping in mappings):
                category = category['id']
                break
            else:
                category = categories[-1]['id']

        if category == categories[-1]['id']:
            category_not_found += 1
            
        return category, category_not_found

    def delete_temp_file(self, file):
        os.remove(file.filename)
        print('Temp file deleted')