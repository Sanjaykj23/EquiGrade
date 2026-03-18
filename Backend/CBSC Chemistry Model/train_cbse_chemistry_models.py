import json, numpy as np, faiss, joblib, os
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading CBSE Chemistry dataset...")
try:
    with open("cbse_chemistry_dataset.json", "r", encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: Dataset JSON not found. Run the extraction script first!")
    exit()

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Tiering Chemistry questions
kmeans = KMeans(n_clusters=3, random_state=42).fit(vectors)
q_to_cluster = {q["question"]: kmeans.labels_[i] for i, q in enumerate(data)}

# FAISS Vector Store
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "cbse_chemistry_vector_index.faiss")

# Synthetic Training: CBSE Chemistry is out of 70 marks
print("Generating 2000 synthetic CBSE Chemistry papers...")
papers = []
for i in range(2000):
    sample = np.random.choice(data, 33) 
    c_list = [q_to_cluster[q["question"]] for q in sample]
    easy, med, hard = c_list.count(0), c_list.count(1), c_list.count(2)
    
    diff = (easy*0.3 + med*0.6 + hard*1.0) / 33
    # Chemistry specific base mean ~54/70
    marks = 54 - (diff * 18) + (np.random.randint(2,8) * 0.4)
    
    papers.append([easy, med, hard, np.random.randint(2,8), np.mean([len(q["question"]) for q in sample]), diff, marks])

X, y = np.array(papers)[:, :-1], np.array(papers)[:, -1]
model = RandomForestRegressor(n_estimators=200).fit(X, y)

joblib.dump(model, "cbse_chemistry_score_model.pkl")
joblib.dump(kmeans, "cbse_chemistry_cluster_model.pkl")
print("CBSE Chemistry Models Saved.")