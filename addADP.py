import json

with open('draft-helper/src/data/field_ranks.json') as f:
    field_data = json.load(f)

with open('draft-helper/src/data/tristan_ranks.json') as f:
    tristan_data = json.load(f)

with open('draft-helper/src/data/clay_ranks.json') as f:
    clay_data = json.load(f)

with open('draft-helper/src/data/fantasy-pros.json') as f:
    fantasy_pro_data = json.load(f)

with open('draft-helper/src/data/adp.json') as f:
    adp_data = json.load(f)

for adp in adp_data:
    for f_data in field_data:
        if adp['Name'] in f_data['Name'] or f_data['Name'] in adp['Name']:
            f_data['ADP'] = adp['ADP']
    for t_data in tristan_data:
        if adp['Name'] in t_data['Name'] or t_data['Name'] in adp['Name']:
            t_data['ADP'] = adp['ADP']
    for c_data in clay_data:
        if adp['Name'] in c_data['Name'] or c_data['Name'] in adp['Name']:
            c_data['ADP'] = adp['ADP']
    for fp_data in fantasy_pro_data:
        if adp['Name'] in fp_data['Name'] or fp_data['Name'] in adp['Name']:
            fp_data['ADP'] = adp['ADP']

with open('draft-helper/src/data/field_ranks.json', 'w') as f:
    f.write(json.dumps(field_data, indent=4))

with open('draft-helper/src/data/tristan_ranks.json', 'w') as f:
    f.write(json.dumps(tristan_data, indent=4))

with open('draft-helper/src/data/clay_ranks.json', 'w') as f:
    f.write(json.dumps(clay_data, indent=4))

with open('draft-helper/src/data/fantasy-pros.json', 'w') as f:
    f.write(json.dumps(fantasy_pro_data, indent=4))