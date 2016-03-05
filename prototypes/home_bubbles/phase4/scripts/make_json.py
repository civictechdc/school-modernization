import csv, json

data = []
count = 0
# Read csv
with open('../../data/data_master.csv', 'rU') as file:
   reader = csv.DictReader(file)
   for row in reader:
      data.append(row)
      count += 1 

   data_for_json = {
      'name': 'Schools',
      'children': []
   }

   for datum in data:
      tempObj = {}
      tempObj['name'] = datum['School'].title()
      tempObj['value'] = datum['MajorExp9815']
      tempObj['agency'] = datum['Agency']

      data_for_json['children'].append(tempObj)

# Make JSON file
raw_data = json.dumps(data_for_json, indent=4);
with open('phase4.json', 'w+') as json_file:
   json_file.write(raw_data)
