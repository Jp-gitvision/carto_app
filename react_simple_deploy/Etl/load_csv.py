import pandas as pd
from sqlalchemy import create_engine
import mysql.connector

def create_database(conn_info):
    try:
        conn_info_without_db = conn_info.copy()
        conn_info_without_db.pop('database', None)
        cnx = mysql.connector.connect(**conn_info_without_db)
        cursor = cnx.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{conn_info['database']}`;")
        print(f"Base de données {conn_info['database']} créée ou déjà existante.")
    except Exception as e:
        print(f"Erreur lors de la création de la base de données {conn_info['database']} : {str(e)}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'cnx' in locals():
            cnx.close()

conn_info = {
    'user': 'julien',
    'password': 'julien75012',
    'host': 'database-personne-age.ct0ywk044gpj.eu-west-3.rds.amazonaws.com', 
    'port': 3306,
    'database': 'database-personne-age'
}

# Créer la base de données si elle n'existe pas
create_database(conn_info)

# Création de l'engine SQLAlchemy
engine = create_engine(f"mysql+mysqlconnector://{conn_info['user']}:{conn_info['password']}@{conn_info['host']}:{conn_info['port']}/{conn_info['database']}")

# Traiter les données pour les températures moyennes, minimales et maximales
csv_file_path = "/Users/jujupeneau/Desktop/Wildcodeschool_Data_engineer/projet/Lama_dev_login/my-react-passport-app/public/data/age_insee_with_coordinates_cleaned.csv"

# transformer csv en dataframe
df = pd.read_csv(csv_file_path)

# Charger les données de température moyenne dans la base de données MySQL
df.to_sql('database-personne-age', con=engine, if_exists='replace', index=False, chunksize=10000)

