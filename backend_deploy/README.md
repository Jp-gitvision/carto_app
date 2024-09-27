# Construire l'image docker :
docker build -t my-express-app .

# Executer le contenu du docker:
docker run -p 4000:4000 -v $(pwd):/app -v /app/node_modules -d my-express-app

# Voir si le conteneur est bien actif
 docker ps

 # Commande pour voir si il y a des erreurs 
 docker logs f6da37335394 (conteneur id)
