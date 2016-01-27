import csv
import json

s = "DC_Schools_Master_Fin.csv"
with open(s, 'r') as f:
    reader = csv.DictReader(f)

    dcps_lst = []
    pcs_lst = []
    for row in reader:

        if row.get('Agency') == 'DCPS':
            dcps_lst.append(row)
        elif row.get('Agency') == "PCS":
            pcs_lst.append(row)
        else:
            print "Error!", row

    donut_json = {
        "name": "Total Spending",
        "children": [
            {
                "name": "DCPS Capital Spending",
                "children": dcps_lst
            },
            {
                "name": "PCS Capital Spending Est",
                "children": pcs_lst,
            },
            {
                "name": "Unallocated Spending",
                "MajorExp9815": "1500000000",
                "TotalAllotandPlan1621" : "1811500000",
            }
        ]
    }

    raw_d = json.dumps(donut_json)
    with open("donut.json", "w") as f:
        f.write(raw_d)
