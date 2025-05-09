from pypdf import PdfReader
from datetime import datetime
import re
import os

class PdfParser:
    def __init__(self):
        self.key_words = {
            "first_page": {
                "begin_key_word": "Alter Saldo",
                "end_key_word": "Übertrag Saldo"
            },
            "middle_page": {
                "begin_key_word": "Übertrag Saldo",
                "end_key_word": "Übertrag Saldo"	
            },
            "last_page": {
                "begin_key_word": "Übertrag Saldo",
                "end_key_word": "Neuer Saldo"
            }
        }
            
        print('Pdf Parser initialized')

    def parse_pdf(self, file, categories):
        filename = self.create_temp_file(file)
        items = self.extract_text(filename)
        json_list = self.create_json(categories, items)
        self.delete_temp_file(file)
        return json_list

    def create_temp_file(self, file):
        contents = file.file.read()
        with open(file.filename, 'wb') as file_object:
            file_object.write(contents)

        return file.filename

    def extract_text(self, input_file_path):
        reader = PdfReader(input_file_path)
        number_of_pages = len(reader.pages)
        items = []

        for i in range(number_of_pages):
            page = reader.pages[i]
            text = page.extract_text()

            if i == 0: # first page
                page_type = 'first_page' 
            elif i == number_of_pages - 1: # last page
                page_type = 'last_page'
            else: # all other pages
                page_type = 'middle_page'

            begin_key_word = self.key_words[page_type]['begin_key_word']
            end_key_word = self.key_words[page_type]['end_key_word']

            item = self.get_relevant_content(text, begin_key_word, end_key_word)
            items.extend(item)

        return items

    def get_relevant_content(self, text, begin_key_word, end_key_word):
        beginning = text.find(begin_key_word)
        end = text.find(end_key_word)
        
        if beginning == end:
            end = text.find(end_key_word, end + len(end_key_word))

        data = text[beginning:end]

        pattern = r'\d{2}\.\d{2}\.\d{4}'
        item = re.split(f'(?={pattern})', data)
        return item

    def create_json(self, categories, items):
        category_not_found = 0
        key = 0
        json_list = []
        name = 'Kartenumsatz'
        for item in items:
            if name in item:
                # Extract date
                date_pattern = r'\d{2}\.\d{2}\.\d{4}'
                date_match = re.search(date_pattern, item)
                if date_match:
                    raw_date = date_match.group()
                    date = datetime.strptime(raw_date, '%d.%m.%Y').strftime('%Y-%m-%d')
                else:
                    date = None
                    print('Date not found @ ' + item)
                    
                # Extract purpose and amount
                purpose_amount_pattern = name + r'\n(.*?),\s*(.*?)\s*(-?\d+,\d{2})'
                purpose_amount_match = re.search(purpose_amount_pattern, item, re.DOTALL)

                if purpose_amount_match:
                    key += 1
                    purpose = purpose_amount_match.group(1).strip()
                    amount = float(purpose_amount_match.group(3).replace('.', '').replace(',', '.'))
                    category, category_not_found = self.get_category(categories, category_not_found, purpose)
                    
                    json_item = {
                        'key': key,
                        'date': date,
                        'name': name,
                        'purpose': purpose,
                        'amount': amount,
                        'category': category,
                        'isAllowed': True
                    }
                    json_list.append(json_item)
                else:
                    print('Purpose and amount not found @ ' + item)
        
        if category_not_found > 0:
            print('Categories not found:', category_not_found, 'out of', len(json_list))
        else: 
            print('All categories found for', len(json_list), 'items')
        return json_list

    def get_category(self, categories, category_not_found, purpose):
        for category in categories:
            if category['mapping'] != None:
                mappings = category['mapping'].split(';')
            else:
                mappings = []

            if any(mapping.strip().lower() in purpose.lower() for mapping in mappings):
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