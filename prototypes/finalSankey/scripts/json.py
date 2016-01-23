import json

data = {
        'name' : 'Joey',
        'age' : 25,
        'Cool' : True
}

json_str = json.dumps(data)

print 'data is %s' % data
print 'json_str is %s ' % json_str`