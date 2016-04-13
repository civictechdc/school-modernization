import csv, json

# Read csv
with open('data/multischool_final.csv', 'rU') as file:
   reader = csv.DictReader(file)

   data_for_json = {
      'name': 'Projects',
      'children': []
   }

   for row in reader:
      tempObj = {}
      tempObj['name'] = row['projectType'].title()
      tempObj['value'] = row['lifetimeBudget']
      data_for_json['children'].append(tempObj)

# Make JSON file
raw_data = json.dumps(data_for_json, indent=4);
with open('multi_school.json', 'w+') as json_file:
   json_file.write(raw_data)