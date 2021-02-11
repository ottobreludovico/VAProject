import numpy as np
import csv
import sys
from sklearn.manifold import TSNE

if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    file = '../Dataset/pronto2.csv'

if len(sys.argv) > 2:
    out_file = sys.argv[2]
else:
    out_file = '../Dataset/globalterrorisTSNE.csv'


data = []
with open(file, mode='r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
            header = row
        else:
            if (float(row[header.index('nkill')]) >= 0):
                data.append(row)
                line_count += 1


for el in data:
    for field in el:
        if field == '':
            i = data.index(el)
            j = el.index(field)
            data[i][j] = 0.0

def mapRegionType(rT):
    if rT == "Southeast Asia":
        return 1
    elif rT == "Central America & Caribbean":
        return 2
    elif rT == "Western Europe":
        return 3
    elif rT == "North America":
        return 4
    elif rT == "Middle East & North Africa":
        return 5
    elif rT == "South America":
        return 6
    elif rT == "South Asia":
    	return 7
    elif rT == "South Africa":
    	return 8
    elif rT == "Eastern Europe":
    	return 9
    elif rT == "Sub-Saharan Africa":
    	return 10
    elif rT == "Australasia & Oceania":
    	return 11
 	#"Central Asia":
    else:
        return 0


data_for_tSNE = []
for el in data:
    data_for_tSNE.append(
        [float(mapRegionType(el[header.index('region_txt')])),
        float(el[header.index('latitude')]), 
        float(el[header.index('longitude')]), 
        float(el[header.index('nkill')]),]
        )

tSNEComponents = TSNE(n_components=2).fit_transform(data_for_tSNE)
max_x, max_y, min_x, min_y = None, None, None, None
first_iteration = True
for component in tSNEComponents:
    if first_iteration:
        min_x = component[0]
        min_y = component[1]
        first_iteration = False
    else:
        if component[0] < min_x:
            min_x = component[0]
        if component[1] < min_y:
            min_y = component[1]

for component in tSNEComponents:
    component[0] = component[0] + abs(min_x)
    component[1] = component[1] + abs(min_y)
    
with open(out_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    lenComponents = len(tSNEComponents)
    index = 0
    for el in data:
        if index == 0:
            header.extend(["tSNE_1", "tSNE_2"])
            writer.writerow(header)
        el.extend(tSNEComponents[index])
        writer.writerow(el)
        index += 1