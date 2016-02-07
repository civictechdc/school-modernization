import json
import csv
import pprint

# CACHE THE DATA
#------------------------------------------------#
data = []
with open('../data/data.csv', 'rU') as file:  
   reader = csv.DictReader(file)
   for row in reader:
      data.append(row)


# UTILITY FUNCTIONS
#------------------------------------------------#
def find_num_feeders():
   max = 0
   for i in data:
      if i['FeederHSNum'] > max:
         max = i['FeederHSNum']
   return max

def ppr(item):
   pp.pprint(item)

# GLOBALS
#------------------------------------------------#
pp = pprint.PrettyPrinter(indent=4)
num_feeders = find_num_feeders()


# OPERATIONS
#------------------------------------------------#

#Find min and max
max, min = 0, 0;
for datum in data:
   if datum['MajorExp9815'] and datum['MajorExp9815'] != "NA":
      if int(datum['MajorExp9815']) > max:
         max = int(datum['MajorExp9815'])
      if int(datum['MajorExp9815']) < min: 
         min = int(datum['MajorExp9815'])
print min, max

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


# Seperate schools into feeder pattern arrays
# List comprehensions!
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
