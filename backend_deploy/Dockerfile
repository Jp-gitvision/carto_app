# Utiliser une image officielle de Node.js comme image de base
FROM node:18

# Créer un utilisateur et groupe nodemon
RUN groupadd -r nodemon && useradd -r -g nodemon nodemon

# Installer net-tools pour pouvoir utiliser netstat
RUN apt-get update && apt-get install -y net-tools

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application et changer le propriétaire
COPY --chown=nodemon:nodemon . .

# Exposer le port 4000
EXPOSE 4000

# Définir les variables d'environnement
ENV HOST=0.0.0.0
ENV PORT=4000

# Installer Nodemon globalement
RUN npm install -g nodemon

# Utiliser l'utilisateur nodemon
USER nodemon

# Commande pour lancer l'application avec Nodemon
CMD ["nodemon", "index.js"]


# construisez l'image Docker :
# docker build -t my-express-app11 .

# Executer le conteneur docker :
# docker run -p 4000:4000 -d my-express-app11
    
# Lister tous les conteneurs dockers en cours d'execution
# docker ps

# Pousser l'image sur docker hub :

#1# Se connecter à Docker hub : 
# docker login

#2# Taggez l'image avec une version spécifique :
# docker tag my-express-app jujupeneau/my-express-app11:v1.0

#3# Poussez l'image taguée vers Docker Hub :
# docker push jujupeneau/my-express-app11:v1.0

# Créer une instance EC2 sur AWS et deployer le backend :

#1# Utiliser ssh pour vous connecter à l'instance ec2 depuis votre terminal en local :
# ssh -i "/Users/jujupeneau/Downloads/clef.pem" ubuntu@ec2-15-188-54-179.eu-west-3.compute.amazonaws.com

#2# Mettre à jour le système :
# sudo apt-get update
# sudo apt-get upgrade -y

#3# Installer docker
# sudo apt-get install -y docker.io
# sudo systemctl start docker
# sudo systemctl enable docker
# sudo usermod -aG docker $USER
# newgrp docker

#3# Connectez vous à docker hub :
# docker login

# id : jujupeneau
# mdp : azertyuiop

#4# Tirer l'image Docker depuis Docker Hub :
# docker pull jujupeneau/my-express-app11:v1.0

#5# Exécuter le conteneur Docker :
# docker run -d -p 4000:4000 jujupeneau/my-express-app11:v1.0

#6# Configuration des groupes de sécurité : Vous avez configuré les groupes de sécurité pour permettre l'accès à votre instance EC2 et à votre base de données RDS

#7# Essayer de vous connecter à votre base de donnée RDS depuis votre instance ec2
# mysql -h database-personne-age.ct0ywk044gpj.eu-west-3.rds.amazonaws.com -u julien -p

#8# Accéder à votre application (backend)
# ec2-15-188-54-179.eu-west-3.compute.amazonaws.com et tester les routes API pour voir si tout fonctionne bien : ec2-15-188-54-179.eu-west-3.compute.amazonaws.com/api/personnes-agees-par-regions

# Déployer le front end en utilisant la même instance ec2

#1# Install Node.js and NPM:
# curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
# sudo apt-get install -y nodejs

#2# Verifier les installations
# node -v
# npm -v

#3# Sur votre instance EC2, accordez les permissions
# sudo chown -R ubuntu:ubuntu /home/ubuntu/react-app
# sudo chmod -R 755 /home/ubuntu/react-app

#4# Vérifiez les permissions
# ls -ld /home/ubuntu/react-app

#5# # Sur votre machine locale, transférez les fichiers
# scp -i "/Users/jujupeneau/Downloads/clef.pem" -r /Users/jujupeneau/Desktop/Wildcodeschool_Data_engineer/projet/Lama_dev_login/react_simple ubuntu@ec2-15-188-54-179.eu-west-3.compute.amazonaws.com:/home/ubuntu/

#6# Installer la version de node v18 grâce à ce lien : https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04

#7# npm install puis npm start











