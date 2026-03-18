import json, numpy as np, faiss, joblib, os
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading CBSE Mathematics dataset...")
try:
    with open("cbse_maths_dataset.json", "r", encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: Run the Maths extraction script first!")
    exit()

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Concept Clustering (Calculus, Vectors, Probability)
kmeans = KMeans(n_clusters=3, random_state=42).fit(vectors)
q_to_cluster = {q["question"]: kmeans.labels_[i] for i, q in enumerate(data)}

# Save FAISS Index
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "cbse_maths_vector_index.faiss")

# Synthetic Training: Adjusted for CBSE 14-question / 40-mark format
print("Generating synthetic CBSE Maths papers...")
papers = []
for i in range(2000):
    sample = np.random.choice(data, 14)
    c_list = [q_to_cluster[q["question"]] for q in sample]
    easy, med, hard = c_list.count(0), c_list.count(1), c_list.count(2)
    
    diff = (easy*0.2 + med*0.5 + hard*1.0) / 14
    # CBSE Math Logic: Base mean ~32/40
    marks = 34 - (diff * 15) + (np.random.randint(1,5) * 0.5)
    
    papers.append([easy, med, hard, np.random.randint(1,4), np.mean([len(q["question"]) for q in sample]), diff, marks])

X, y = np.array(papers)[:, :-1], np.array(papers)[:, -1]
model = RandomForestRegressor(n_estimators=200).fit(X, y)

joblib.dump(model, "cbse_maths_score_model.pkl")
joblib.dump(kmeans, "cbse_maths_cluster_model.pkl")
print("CBSE Maths Models Saved Successfully!")