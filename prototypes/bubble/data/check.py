import csv, os

data = []
with open('multi_school.csv', 'r') as file:
	reader = csv.reader(file)
	for row in reader:
		data.append(row)

for datum in data:
	print datum
