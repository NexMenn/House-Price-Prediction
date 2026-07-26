import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';
import { predictPrice, ApiError } from '../api/predictionClient';
import type { PredictionRequest } from '../types/prediction';

export default function HomePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(payload: PredictionRequest) {
    setSubmitting(true);
    setServerError(null);
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { payload, predictedPrice: result.predicted_price } });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="title-block">
        <h1>House Price Estimator</h1>
      </div>
      <div className="panel">
        <PredictionForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
      </div>
    </div>
  );
}
