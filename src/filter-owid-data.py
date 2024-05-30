import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / 'data'
INPUT_FILE = DATA_DIR / 'owid-co2-data.json'

with open(INPUT_FILE) as infile:
    input_data = json.load(infile)

filtered_data = {}
yearly_min_max = {}
for country, value in input_data.items():
    iso_code = value.get("iso_code")
    if (iso_code is None or len(iso_code) != 3):
        # not a country, or missing iso_code
        continue

    filtered_data[iso_code] = {}
    for annual_data in value['data']:
        year = annual_data['year']
        share_global_co2 = annual_data.get('share_global_co2')
        co2 = annual_data.get('co2')

        if (share_global_co2 is not None):
            if (year not in yearly_min_max):
                yearly_min_max[year] = {
                    "max_share_global_co2": share_global_co2,
                    "min_share_global_co2": share_global_co2
                }
            else:
                if (share_global_co2 > yearly_min_max[year]["max_share_global_co2"]):
                    yearly_min_max[year]["max_share_global_co2"] = share_global_co2
                if (share_global_co2 < yearly_min_max[year]["min_share_global_co2"]):
                    yearly_min_max[year]["min_share_global_co2"] = share_global_co2

            filtered_data[iso_code][year] = {
                'share_global_co2': share_global_co2,
                'co2': co2
            }

filtered_data['yearly_min_max'] = yearly_min_max

with open("test.json", "w") as outfile:
    json.dump(filtered_data, outfile, indent=4)
