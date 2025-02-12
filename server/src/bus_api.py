########### Python 3.2 #############
import urllib.request, json

try:
    url = "https://api.nationaltransport.ie/gtfsr/v2/gtfsr?format=json"

    hdr ={
    # Request headers
    'Cache-Control': 'no-cache',
    'x-api-key': '704561a2a3964364bf1955be3e3ab53f',
    }

    req = urllib.request.Request(url, headers=hdr)

    req.get_method = lambda: 'GET'
    response = urllib.request.urlopen(req)
    print(response.getcode())
    #print(json.loads(response.read().decode()))
    with open("data.json", "w") as f:
        json.dump(json.loads(response.read().decode()), f)
    #filetest.close()
except Exception as e:
    print(e)
####################################
