import type { PredictionRequest, PredictionResponse } from '../types/prediction';
import locationsData from '../data/locations.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {}

export async function predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("Couldn't reach the prediction server. Is the backend running?");
  }

  if (!response.ok) {
    let detail = "The server couldn't produce an estimate for these details.";
    try {
      const body = await response.json();
      detail = body.detail ? JSON.stringify(body.detail) : detail;
    } catch {
    }
    throw new ApiError(detail);
  }

  return (await response.json()) as PredictionResponse;
}

export async function fetchLocations(): Promise<string[]> {
  return locationsData as string[];
}
