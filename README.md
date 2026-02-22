EquiGrade: AI-Driven Cross-Board Mark Normalization
🎓 The Problem: The "Raw Mark" Trap in TNEA
In competitive admissions like TNEA (Tamil Nadu Engineering Admissions), students from various boards (CBSE, State Board, ICSE) are ranked based on their raw percentage. However, this creates a massive inequality:

Difficulty Gap: A 192/200 in an application-heavy CBSE Physics paper often requires more mastery than a 198/200 in a straightforward State Board paper.

The Consequence: High-potential students from "tougher" boards miss out on merit seats in top-tier colleges (CEG, MIT, PSG) and are forced into the Management Quota, incurring huge financial burdens.

EquiGrade restores fairness by using AI to normalize scores based on question paper toughness and statistical distribution.

🚀 Features
QPDI (Question Paper Difficulty Index): An NLP-based engine that scans exam PDFs to categorize questions (Easy/Medium/Hard) using Bloom’s Taxonomy.

Adaptive Normalization: Moves beyond simple scaling to apply Percentile Equating, comparing a student's performance against their specific board's peer group.

Merit Simulator: A dashboard where students can see their "Equated Cut-off" and predicted college rankings.

Transparency Reports: Generates a detailed mathematical breakdown of how the raw score was converted to a Normalized Competency Score (NCS).

🛠 Tech Stack
Backend (AI & Logic)
Python 3.10+: Core programming language.

FastAPI: For high-performance, asynchronous API endpoints.

NLP (SpaCy/HuggingFace): To analyze question paper text and determine "toughness."

Scikit-learn: For statistical normalization algorithms (Z-Score, Percentile Scaling).

Frontend (UI/UX)
React.js + Vite: Modern, fast frontend framework.

Tailwind CSS: For a clean, professional "Gov-Tech" aesthetic.

Recharts: To visualize score distributions and bell curves.

Database
PostgreSQL: To store board metadata, historical topper data, and user profiles.