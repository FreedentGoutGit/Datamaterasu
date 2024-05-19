import csv
import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / 'data'
FILE_CITIES = DATA_DIR / 'worldcities.csv'
FILE_GGMCF = DATA_DIR / 'GGMCF_top500cities.tsv'


# basic function to find the lat/long of a city
def find_city(city_name: str, country_name=None):
    # make everything lowercase for easier comparisons
    city_name = city_name.lower()
    if country_name:
        country_name = country_name.lower()

    # some hardcoded country "translations" between datasets
    if country_name == 'uk':
        country_name = "gb"
    elif country_name == "uae":
        country_name = "are"
    elif country_name == "south korea":
        country_name = "kr"
    elif country_name == "viet nam":
        country_name = "vietnam"

    # hardcoded translations for cities
    if city_name == "hong kong sar":
        city_name = "hong kong"
    elif city_name == "country of singapore":
        city_name = "singapore"

    # sometimes the city exists without an apostrophe, or with a space where a hyphen is
    # this lets us consider all possible options
    city_names = [city_name, city_name.replace("'", ''), city_name.replace('-', ' ')]

    for city in cities:
        country_names = [city['country'].lower(), city['iso2'].lower(), city['iso3'].lower(), None]
        if city['city_ascii'].lower() in city_names and country_name in country_names:
            return (city['lat'], city['lng'])

    return (None, None)


# import <city name> -> <lat/long> dataset
cities = []
with open(FILE_CITIES) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cities.append(row)

# import GGMCF dataset, and get lat/long for each city
data_out = []
data_not_found = []
with open(FILE_GGMCF) as datafile:
    reader = csv.DictReader(datafile, delimiter='\t')
    for row in reader:
        city = row['Urban Cluster']
        country = row['Country']
        footprint = row['Footprint (Mt CO2)'].split(' &plusmn')[0]  # just want the Mt, don't care about +/-

        # Some 'cities' come in as "Unknown city at lat/lon 37.5, 112.1", can grab directly
        if ("Unknown city" in city):
            matches = re.findall(r"\d+\.\d+", city)
            lat = matches[0]
            lng = matches[1]
        else:
            (lat, lng) = find_city(city, country)

        if lat is None or lng is None:
            # if did not find, store anyways in case we want to deal with in the future
            data_not_found.append({
                'city': city,
                'country': country,
                'footprint (Mt CO2)': footprint
            })
        else:
            assert (lat is not None)
            assert (lng is not None)
            data_out.append({
                'city': city,
                'country': country,
                'footprint (Mt CO2)': footprint,
                'lat': lat,
                'lng': lng,
            })

with open("data.json", "w") as outfile:
    json.dump(data_out, outfile, indent=4)

with open("data_not_found.json", 'w') as outfile:
    json.dump(data_not_found, outfile, indent=4)

print(f"Found coordinates for {len(data_out)} cities!")
print(f"Did not find coordinates for {len(data_not_found)} cities :(")
