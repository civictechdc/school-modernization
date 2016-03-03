import csv, json

data = []
# Read csv
with open('../../data/data_master.csv', 'rU') as file:
   reader = csv.DictReader(file)
   # csv_data = [row for row in reader]
   # print csv_data

   for row in reader:
      if row['Agency'] == 'DCPS':
         data.append(row)
   

   data_for_json = {
      'name': 'Schools',
      'children': []
   }

   for datum in data:
      tempObj = {}
      tempObj['name'] = datum['School'].title()
      tempObj['value'] = datum['MajorExp9815']
      # print tempObj['name']
      data_for_json['children'].append(tempObj)

   # print(data_for_json)

# Make JSON file
raw_data = json.dumps(data_for_json, indent=4);
with open('phase2.json', 'w+') as json_file:
   json_file.write(raw_data)
