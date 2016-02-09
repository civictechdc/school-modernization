import csv
import json

def conv_to_node(key, value):
    if len(value) == 1:
        value[0]["name"] = key
        return value[0]
    return {
            "name": key,
            "children": value,
    }

s = "donutDummyData.csv"
with open(s, 'r') as f:
    reader = csv.DictReader(f)

    dcps_lst = []
    pcs_lst = []
    multi_lst = []
    for row in reader:
        if row.get('Agency') == 'DCPS':
            dcps_lst.append(row)
        elif row.get('Agency') == "PCS":
            pcs_lst.append(row)
        elif row.get('Agency') == "Multischool":
            multi_lst.append(row)
        else:
            print "Error!", row


    # Handle DCPS MultiSchool Spending
    # Convert multischool rows into an object catergorized by project type
    proj_type_dict = {}
    for r in multi_lst:
        t = r['ProjectType']
        p_lst = proj_type_dict.get(t, [])
        p_lst.append(r)
        proj_type_dict[t] = p_lst

    multi_lst = [conv_to_node(k, v) for k, v in proj_type_dict.iteritems()]

    # Handle PCS Charter Operator Merging
    charter_op_dict = {}
    for r in pcs_lst:
        t = r['Operator']
        op_lst = charter_op_dict.get(t, [])
        op_lst.append(r)
        charter_op_dict[t] = op_lst

    pcs_lst = [conv_to_node(k, v) for k, v in charter_op_dict.iteritems()]

    donut_json = {
        "name": "Total Spending",
        "children": [
            {
                "name": "DCPS Capital Spending",
                "children": dcps_lst,
            },
            {
                "name": "PCS Annual Distribution",
                "children": pcs_lst,
            },
            {
                "name": "DCPS Multischool Projects",
                "children": multi_lst,
            },
        ]
    }

    raw_d = json.dumps(donut_json)
    with open("donut.json", "w") as f:
        f.write(raw_d)

