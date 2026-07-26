import { Link, useLocation, Navigate } from "react-router-dom";
import type { PredictionRequest } from "../types/prediction";

interface ResultState {
  payload: PredictionRequest;
  predictedPrice: number;
}

function formatIndianPrice(value: number): string {
  if (value >= 1e7) return `₹ ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹ ${(value / 1e5).toFixed(1)} Lac`;
  return `₹ ${value.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const state = location.state as ResultState | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { payload, predictedPrice } = state;

  return (
    <div className="page">
      <div className="title-block">
        <h1>Your Estimate</h1>
        <p>Based on the details you provided, here's the model's predicted price.</p>
      </div>

      <div className="panel center-col">
        <div className="estimate-stamp">
          <span className="label">Estimated value</span>
          <span className="value">{formatIndianPrice(predictedPrice)}</span>
        </div>

        <div className="result-summary">
          <dl>
            <div>
              <dt>Location</dt>
              <dd>{payload.location}</dd>
            </div>
            <div>
              <dt>Carpet area</dt>
              <dd>{payload.carpet_area_sqft} sqft</dd>
            </div>
            <div>
              <dt>Floor</dt>
              <dd>{payload.floor_num}</dd>
            </div>
            <div>
              <dt>Bathrooms</dt>
              <dd>{payload.bathroom}</dd>
            </div>
            <div>
              <dt>Balconies</dt>
              <dd>{payload.balcony}</dd>
            </div>
            <div>
              <dt>Furnishing</dt>
              <dd>{payload.furnishing}</dd>
            </div>
            <div>
              <dt>Transaction</dt>
              <dd>{payload.transaction}</dd>
            </div>
            <div>
              <dt>Ownership</dt>
              <dd>{payload.ownership}</dd>
            </div>
            <div>
              <dt>Facing</dt>
              <dd>{payload.facing}</dd>
            </div>
          </dl>
        </div>

        <div className="submit-row" style={{ justifyContent: "center", marginTop: 24 }}>
          <Link to="/" className="btn-secondary">
            ← New estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
