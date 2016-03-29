import csv, json, random

public, charter = [], []

# Read csv
with open('../../data/data_master_214.csv', 'rU') as file:
   reader = csv.DictReader(file)
   for row in reader:
      if row['Agency'] == 'DCPS':
         public.append(row)
      else:
         charter.append(row)

   def make_obj(set):
      json_template = {
         'name': 'Schools',
         'children': []
      }
      
      for datum in set:
         tempObj = {}
         tempObj['name'] = datum['School'].title()

         if datum['TotalAllotandPlan1621'] != 'NA':
            tempObj['value_available'] = True
            if float(datum['TotalAllotandPlan1621']) > 0:
               tempObj['value'] = str(int(float(datum['TotalAllotandPlan1621'])))
            else:
               tempObj['value'] = '3'
               tempObj['value_issue'] = 'below zero'
               tempObj['real_value'] = float(datum['TotalAllotandPlan1621'])
         else:
            tempObj['value'] = '5'
            tempObj['value_issue'] = 'not available'
            tempObj['real_value'] = datum['TotalAllotandPlan1621']
            tempObj['value_available'] = False

         tempObj['agency'] = datum['Agency']
         json_template['children'].append(tempObj)

      return json_template


# Make JSON files
raw_data = json.dumps(make_obj(public), indent=4);
with open('public.json', 'w+') as json_file:
   json_file.write(raw_data)

raw_data = json.dumps(make_obj(charter), indent=4);
with open('charter.json', 'w+') as json_file:
   json_file.write(raw_data)
