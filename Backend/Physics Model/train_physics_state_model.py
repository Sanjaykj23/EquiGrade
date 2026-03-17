import json
import numpy as np
import faiss
import joblib

from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

print("Loading dataset...")

with open("physics_state_dataset.json") as f:
    data = json.load(f)

questions = [q["question"] for q in data]

print("Total questions:", len(questions))

# -------------------------
# LOAD EMBEDDING MODEL
# -------------------------

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

print("Generating question embeddings...")

vectors = embed_model.encode(questions)

vectors = np.array(vectors).astype("float32")

# -------------------------
# CLUSTER QUESTIONS
# -------------------------

print("Clustering questions...")

kmeans = KMeans(n_clusters=3, random_state=42)

clusters = kmeans.fit_predict(vectors)

for i,item in enumerate(data):
    item["cluster"] = int(clusters[i])

# -------------------------
# BUILD FAISS VECTOR INDEX
# -------------------------

print("Building FAISS vector index...")

dimension = vectors.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(vectors)

faiss.write_index(index,"physics_vector_index.faiss")

print("FAISS index saved")

# -------------------------
# SYNTHETIC PAPER GENERATION
# -------------------------

print("Generating synthetic papers...")

papers = []

for i in range(2000):

    sample = np.random.choice(data,48)

    easy = sum(1 for q in sample if q["cluster"]==0)
    medium = sum(1 for q in sample if q["cluster"]==1)
    hard = sum(1 for q in sample if q["cluster"]==2)

    difficulty = (easy*0.3 + medium*0.6 + hard*1.0)/48

    avg_length = np.mean([len(q["question"]) for q in sample])

    repeated = np.random.randint(5,20)

    marks = 85 - difficulty*35 + repeated*0.4

    papers.append([
        easy,
        medium,
        hard,
        repeated,
        avg_length,
        difficulty,
        marks
    ])

papers = np.array(papers)

X = papers[:,:-1]
y = papers[:,-1]

# -------------------------
# TRAIN SCORE MODEL
# -------------------------

print("Training marks prediction model...")

model = RandomForestRegressor()

model.fit(X,y)

# -------------------------
# SAVE MODELS
# -------------------------

joblib.dump(model,"physics_score_model.pkl")
joblib.dump(kmeans,"physics_cluster_model.pkl")

print("Training complete")