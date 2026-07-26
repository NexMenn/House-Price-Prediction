# House Price Prediction — End-to-End ML Web App

## 📖 Overview
An end-to-end machine learning web application designed to estimate residential property prices based on key property features (e.g., location, carpet area, floor number, furnishing status, etc.).  
The machine learning model is trained on a dataset of Indian residential listings.


## 🏗️ Architecture Diagram
```
┌─────────────────┐        POST /predict        ┌──────────────────┐        .predict()        ┌────────────────────┐
│  React Frontend │ ───────────────────────────▶ │  FastAPI Backend │ ───────────────────────▶ │ house_price.pkl     │
│  (Vite, :5173)  │ ◀─────────────────────────── │     (:8000)      │ ◀─────────────────────── │ (sklearn Pipeline)  │
└─────────────────┘      { predicted_price }      └──────────────────┘      log1p(price)        └────────────────────┘
                                                                                                   trained in
                                                                                          notebooks/house_price_model.ipynb
```
                                                                                          
## 💻 Tech Stack
| Layer      | Technology                                                           |
| ---------- | -------------------------------------------------------------------- |
| Notebook   | Python, pandas, numpy, scikit-learn, matplotlib, seaborn, joblib     |
| Backend    | FastAPI, Pydantic, uvicorn                                           |
| Frontend   | React, TypeScript, Vite, React Router                                |
| Packaging  | Docker (backend)                                                     |

## 📂 Project Structure
```
House-Price-Prediction/
├── notebooks/
│   ├── data/house_prices.csv
│   └── house_price_model.ipynb
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app, CORS, model loaded at startup (lifespan)
│   │   ├── api/routes/prediction.py  # GET /health, POST /predict
│   │   ├── core/config.py            # Settings from .env (pydantic settings)
│   │   ├── schemas/prediction.py     # PredictionRequest / PredictionResponse
│   │   ├── services/
│   │   │   ├── preprocessing.py      # request -> one-row DataFrame
│   │   │   └── inference.py          # load .pkl, run predict
│   │   └── utils/logging_config.py
│   ├── models/
│   │   ├── house_price.pkl           # copied from the notebook
│   │   └── locations.json            
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/predictionClient.ts   # fetch wrapper, base URL from VITE_API_BASE_URL
│   │   ├── components/PredictionForm.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx     
│   │   │   ├── ResultPage.tsx 
│   │   │   └── NotFoundPage.tsx
│   │   ├── types/prediction.ts       # TS types mirroring the backend schema
│   │   ├── data/locations.json       # dropdown options, exported from the notebook
│   │   └── App.tsx                   # routes: / , /result , *  (404)
│   └── .env.example
└── .gitignore
```

## 📊 Dataset
**House Price by Juhi Bhojani**
- Link: [https://www.kaggle.com/datasets/juhibhojani/house-price]
- Download Instructions:
  
  **Manual:**
    1. Download the CSV file from the link above.
    2. Unzip.
    3. Place the dataset.csv file in `notebooks/data/`. 
                                                                            
  **Kaggle CLI (Recommended):**
    1. In terminal:
    ```bash
    pip install kaggle
    ```
    2. Get an API token: Kaggle → Settings → API → "Create New Token"   
    3. Place kaggle.json                   
       in `~/.kaggle/` (macOS/Linux)           
       or `C:\Users\<you>\.kaggle\` (Windows)                
    4. Back to terminal:  
    ```bash
    kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip      
    ```
    
## ⚙️ Setup Steps

## Backend Setup
   1. Open a terminal and navigate to the backend folder:  
      ```bash
      cd backend
      ```
   2. Create and activate a virtual environment:  
      - Windows:  
      ```bash
      python -m venv .venv 
      ```  
      then
      ```bash
      .venv\Scripts\activate 
      ```
      - Linux/Mac:  
      ```bash
      python3 -m venv .venv 
      ```
      then  
      ```bash
      source .venv/bin/activate 
      ```
  3. Install dependencies:  
     ```bash
     pip install -r requirements.txt
     ```
  4. Set up Environment Variables:  
     ```bash
     cp .env.example .env
     ```
  5. Run the FastAPI server:  
     ```bash
     uvicorn app.main:app --reload  
     ```
  **The API will be running on** `http://localhost:8000`   

 ### Run tests:  
 ```bash   
 pytest   
 ```

## Frontend Setup
  1. Open a new terminal and navigate to the frontend folder:  
     ```bash
     cd frontend
     ```
  2. Install Node.js dependencies:  
     ```bash
     npm install
     ```
  3. Set up Environment Variables:  
     ```bash
     cp .env.example .env
     ```
  4. Start the development server:  
     ```bash
     npm run dev  
     ```
  **The web app will be running on** `http://localhost:5173`  

## 🔐 Environment Variables Tables  

### Backend (`backend/.env`)  

| Variable          | Default                         | Description                               |
| ----------------- | ------------------------------- | ----------------------------------------- |
| `APP_NAME`        | `House Price Prediction API`    | Shown in the OpenAPI docs                 |
| `MODEL_PATH`      | `models/house_price.pkl`        | Path to the exported pipeline             |
| `LOCATIONS_PATH`  | `models/locations.json`         | Path to the known-locations list          |
| `CORS_ORIGINS`    | `["http://localhost:5173"]`     | Allowed frontend origins                  |
| `LOG_LEVEL`       | `INFO`                          | Logging verbosity                         |  

### Frontend (`frontend/.env`)  

| Variable               | Default                  | Description                     |
| ---------------------- | ------------------------ | ------------------------------- |
| `VITE_API_BASE_URL`    | `http://localhost:8000`  | Base URL of the FastAPI backend |

## 🔌 API Reference  

### 1. Health Check
- Endpoint: `GET /health`
- Description: Checks the health status of the API and ensures the server is running correctly.  

**cURL Example:**
```bash
curl -X 'GET' \
  'http://localhost:8000/health' \
  -H 'accept: application/json'
```
→
```json
{ "status": "ok" }
```
### 2. Predict Price  
- Endpoint: `POST /predict`   
- Description: Accepts property features and returns the estimated price. 

**cURL Example:**
```bash
curl -X 'POST' \
  'http://localhost:8000/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "location": "varanasi",
    "carpet_area_sqft": 1000,
    "floor_num": 6,
    "bathroom": 2,
    "balcony": 3,
    "furnishing": "Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East"
  }'
```
→
```json
{ "predicted_price": 7887183.15 }
```

**An unknown `location` is automatically mapped to `"other"`**.

## 📈 Model Metrics
Random Forest Model achieved the following performance metrics on the test dataset:

| Metric                         | Value                | Meaning                                                                              |   
| ------------------------------ | -------------------- | -------------------------------------------------------------------------------------|
| MAE (Mean Absolute Error)      | [1679184.2273077306] | Average absolute difference between predicted and actual prices.                     | 
| RMSE (Root Mean Squared Error) | [4706307.66973857]   | Penalizes larger errors more heavily.                                                |   
| R² (R-Squared)                 | [0.8785925740890219] | Proportion of variance in the target variable explained by the model.                |   
| 5-fold CV R²                   | [0.8901601197775358] | Average R-squared score across 5 cross-validation folds, indicating model stability. |  
  
## 📸 Screenshots  

**1. Home Page & Input Form**  

<img width="1899" height="947" alt="Screenshot 2026-07-26 041833" src="https://github.com/user-attachments/assets/97d5cde2-bce8-408a-9481-ae97b975a33a" />

<img width="1899" height="942" alt="Screenshot 2026-07-26 041902" src="https://github.com/user-attachments/assets/7b7e64b0-7dd1-4c3a-aba6-d06e79bbd52f" />

<img width="1897" height="933" alt="Screenshot 2026-07-26 042145" src="https://github.com/user-attachments/assets/1502c044-3931-4a4c-9ca9-23dd900a16fe" />

**2. Result Page**  

<img width="1904" height="950" alt="Screenshot 2026-07-26 042208" src="https://github.com/user-attachments/assets/ba26c2db-0446-457b-8124-965ab81ea440" />
