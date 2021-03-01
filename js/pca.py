import csv
import sys
import time
from datetime import datetime
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    file = '../Dataset/iniziale.csv'

if len(sys.argv) > 2:
    out_file = sys.argv[2]
else:
    out_file = '../Dataset/pronto.csv'


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

def mapWeapType(wT):
    if wT == "Unknown":
        return 1
    elif wT == "Firearms":
        return 2
    elif wT == "Incendiary":
        return 3
    elif wT == "Explosives":
        return 4
    elif wT == "Vehicle":
        return 5
    elif wT == "Melee":
        return 6
    elif wT == "Chemical":
    	return 7
    elif wT == "Sabotage Equipment":
    	return 8
    elif wT == "Biological":
    	return 9
    elif wT == "Suicide":
    	return 10
   #16, 2, 3, 5, 13, 15, 7, 23, empty, other 
    else:
        return 0

def mapAttackType(aT):
    if aT == "Unknown":
        return 1
    elif aT == "Assassination":
        return 2
    elif aT == "Hostage Taking":
        return 3
    elif aT == "Hijacking":
        return 4
    elif aT == "Bombing/Explosion":
        return 5
    elif aT == "Facility/Infrastructure Attack":
        return 6
    elif aT == "Armed Assault":
    	return 7
    elif aT == "Unarmed Assault":
    	return 8
   #3, other 
    else:
        return 9

def mapTargType(tT):
    if tT == "Unknown":
        return 1
    elif tT == "Private Citizens & Property":
        return 2
    elif tT == "Journalists & Media":
        return 3
    elif tT == "Government":
        return 4
    elif tT == "Airports & Aircraft":
        return 5
    elif tT == "Police":
        return 6
    elif tT == "Military":
    	return 7
    elif tT == "Business":
    	return 8
    elif tT == "Terrorist/Non-State Militia":
    	return 9
    elif tT == "Religious Figures/institutions":
    	return 10
    elif tT == "Violent Political Party":
    	return 11
    elif tT == "Tourists":
    	return 12
    elif tT == "Utilities":
    	return 13
    elif tT == "Maritme":
    	return 14
    elif tT == "Transportation":
    	return 15
    elif tT == "Educational Institution":
    	return 16
    elif tT == "Telecommunication":
    	return 17
    elif tT == "Food or Water Supply":
    	return 18
    else:
        return 19

data_for_pca = []
for el in data:
    data_for_pca.append(
        [float(mapWeapType(el[header.index('weaptype1_txt')])),
        float(mapAttackType(el[header.index('attacktype1_txt')])),
        float(el[header.index('region')]),
        float(el[header.index('nkill')]),
        float(mapTargType(el[header.index('targtype1_txt')])), ]

        )
scaled_data_for_pca = StandardScaler().fit_transform(data_for_pca)
pca = PCA(n_components=2)
principalComponents = pca.fit_transform(scaled_data_for_pca)
max_x, max_y, min_x, min_y = None, None, None, None
first_iteration = True
for component in principalComponents:
    if first_iteration:
        min_x = component[0]
        min_y = component[1]
        first_iteration = False
    else:
        if component[0] < min_x:
            min_x = component[0]
        if component[1] < min_y:
            min_y = component[1]

for component in principalComponents:
    component[0] = component[0] + abs(min_x)
    component[1] = component[1] + abs(min_y)
    
with open(out_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    lenComponents = len(principalComponents)
    index = 0
    for el in data:
        if index == 0:
            header.extend(["PCA_1", "PCA_2"])
            writer.writerow(header)
        el.extend(principalComponents[index])
        writer.writerow(el)
        index += 1












