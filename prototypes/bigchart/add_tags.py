import csv

if __name__ == '__main__':

    with open('DCPS-schools.csv', 'r') as f:
        reader = csv.reader(f)

        with open('DCPS-schools-types.csv', 'w') as f:
            writer = csv.writer(f)
            
            for row in reader:
                school_name = row[1]
                row.append(type_of_school(school_name))
                writer.writerow(row)

def type_of_school(school_name):
    if "Elementary School" in school_name:
        return "ES"
    elif "Middle School" in school_name:
        return "MS"
    elif "High School" in school_name:
        return "HS"
    elif "Education Campus" in school_name:
        return "EC"
    else:
        return "Unknown"

