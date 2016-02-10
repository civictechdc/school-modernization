import json, csv, pprint

# CACHE THE DATA
#------------------------------------------------#
data = []
with open('../data/data.csv', 'rU') as file:  
   reader = csv.DictReader(file)
   for row in reader:
      data.append(row)

# GLOBALS
#------------------------------------------------#
num_feeders = 9

# OPERATIONS
#------------------------------------------------#
# Setup the initial state of the data for the json dict
data_for_json = {
   'name': 'Bubble Chart',
   'children': [
      {'name': 'Feeder 1', 'children': []},
      {'name': 'Feeder 2', 'children': []},
      {'name': 'Feeder 3', 'children': []},
      {'name': 'Feeder 4', 'children': []},
      {'name': 'Feeder 5', 'children': []},
      {'name': 'Feeder 6', 'children': []},
      {'name': 'Feeder 7', 'children': []},
      {'name': 'Feeder 8', 'children': []},
      {'name': 'Feeder 9', 'children': []},
   ]
} # dictionary to populate for the json dump

# Seperate schools into feeder pattern array 
feeders = []
for index, item in enumerate(range(int(num_feeders))):
   temp_dict = {}
   temp_dict['feeders'] = [item['School'] for item in data if item['FeederHSNum'] == str(index + 1)]
   temp_dict['sizes'] = [item['MajorExp9815'] for item in data if item['FeederHSNum'] == str(index + 1)]
   feeders.append(temp_dict)

for index, item in enumerate(feeders):
   for m,n in enumerate(feeders[index]['feeders']):
      child_dict = {}  
      child_dict['name'] = item['feeders'][m]
      child_dict['size'] = item['sizes'][m]
      data_for_json['children'][index]['children'].append(child_dict)

# Write the data to a json file
raw_data = json.dumps(data_for_json)
with open('../scripts/json/data.json', 'w') as json_file:
   json_file.write(raw_data)