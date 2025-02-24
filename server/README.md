# Server 

Fast API Python backend 


```bash
cd server 
pip install -r requirements.txt
python main.py
```

## For running the server through Docker 

Do the following from the server directory:
```bash 
docker build -t {image name} . 
docker run -p 8000:8000 {image name}
```
To run an existing container:
```bash
docker start {container ID or name}
```
To stop an existing container from running:
```bash
docker stop {container ID or name}
```

\* To list all containers:
```bash
docker ps
```

### APIs

The `base_api.py` class contains the base API class that all other APIs should inherit from.

### Dot Env file in server

Add a .env file with this 
SUPABASE_URL=https://sawdavbqvabwequzmxpm.supabase.co
SUPABASE_SERVICE_KEY=(see whatsapp)