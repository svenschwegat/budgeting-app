class DataQuerier:
    def __init__(self):
        print('data initialized')

    def query_transactions_per_month(self, data):
        sorted_data = []
        sum_of_income = 0
        sum_of_expenses = 0
        for row in data:
            if row['total_amount'] < 0:
                positive_amount = round(abs(row['total_amount']), 0)
                sorted_data.append({
                    'main_category': row['main_category'],
                    'main_color': row['main_color'],
                    'total_amount': positive_amount
                })

                sum_of_expenses += positive_amount
            if row['total_amount'] >= 0:
                sum_of_income += abs(row['total_amount'])
        
        free_amount = sum_of_income - sum_of_expenses
        if free_amount < 0:
            free_amount = 0
        
        sorted_data.append({
            'main_category': 'Frei',
            'main_color': '24b775',
            'total_amount': round(free_amount, 0)
        })                

        return sorted_data
    