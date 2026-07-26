import { useEffect, useState, type SubmitEvent } from "react";
import type { PredictionRequest } from "../types/prediction";
import { fetchLocations } from "../api/predictionClient";

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"] as const;
const TRANSACTION_OPTIONS = ["New Property", "Resale"] as const;
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
const FACING_OPTIONS = ["East", "West", "North","South","North-East","North-West","South-East","South-West",];

type FormState = {
  location: string;
  carpet_area_sqft: string;
  floor_num: string;
  bathroom: string;
  balcony: string;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
};

const initialState: FormState = {
  location: "",
  carpet_area_sqft: "",
  floor_num: "",
  bathroom: "",
  balcony: "",
  furnishing: FURNISHING_OPTIONS[1],
  transaction: TRANSACTION_OPTIONS[1],
  ownership: OWNERSHIP_OPTIONS[0],
  facing: FACING_OPTIONS[0],
};

interface PredictionFormProps {
  onSubmit: (payload: PredictionRequest) => void;
  submitting: boolean;
  serverError: string | null;
}

export default function PredictionForm({ onSubmit, submitting, serverError }: PredictionFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [locations, setLocations] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    fetchLocations().then((locs) => {
      setLocations(locs);
      if (locs.length > 0) {
        setForm((f) => ({ ...f, location: locs[0] }));
      }
    });
  }, []);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.location) errors.location = "Choose a location.";
    const area = Number(form.carpet_area_sqft);
    if (!form.carpet_area_sqft || Number.isNaN(area) || area <= 0) {
      errors.carpet_area_sqft = "Enter a carpet area greater than 0.";
    }
    if (form.floor_num === "" || Number.isNaN(Number(form.floor_num))) {
      errors.floor_num = "Enter a floor number (0 for ground, -1 for Basement).";
    }
    for (const key of ["bathroom", "balcony"] as const) {
      const v = Number(form[key]);
      if (form[key] === "" || Number.isNaN(v) || v < 0) {
        errors[key] = "Enter a number 0 or more.";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      location: form.location,
      carpet_area_sqft: Number(form.carpet_area_sqft),
      floor_num: Number(form.floor_num),
      bathroom: Number(form.bathroom),
      balcony: Number(form.balcony),
      furnishing: form.furnishing as PredictionRequest["furnishing"],
      transaction: form.transaction as PredictionRequest["transaction"],
      ownership: form.ownership,
      facing: form.facing,
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="field span-2">
        <label htmlFor="location">Location</label>
        <select id="location" value={form.location} onChange={(e) => update("location", e.target.value)}>
          {locations.length === 0 && <option value="">Loading locations…</option>}
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {fieldErrors.location && <span className="error">{fieldErrors.location}</span>}
      </div>

      <div className="field">
        <label htmlFor="carpet_area_sqft">Carpet area (sqft)</label>
        <input
          id="carpet_area_sqft"
          type="number"
          min="1"
          placeholder="e.g. 950"
          value={form.carpet_area_sqft}
          onChange={(e) => update("carpet_area_sqft", e.target.value)}
        />
        {fieldErrors.carpet_area_sqft && <span className="error">{fieldErrors.carpet_area_sqft}</span>}
      </div>

      <div className="field">
        <label htmlFor="floor_num">Floor (0 = ground) (-1 = Basement)</label>
        <input
          id="floor_num"
          type="number"
          placeholder="e.g. 6"
          value={form.floor_num}
          onChange={(e) => update("floor_num", e.target.value)}
        />
        {fieldErrors.floor_num && <span className="error">{fieldErrors.floor_num}</span>}
      </div>

      <div className="field">
        <label htmlFor="bathroom">Bathrooms</label>
        <input
          id="bathroom"
          type="number"
          min="0"
          value={form.bathroom}
          onChange={(e) => update("bathroom", e.target.value)}
        />
        {fieldErrors.bathroom && <span className="error">{fieldErrors.bathroom}</span>}
      </div>

      <div className="field">
        <label htmlFor="balcony">Balconies</label>
        <input
          id="balcony"
          type="number"
          min="0"
          value={form.balcony}
          onChange={(e) => update("balcony", e.target.value)}
        />
        {fieldErrors.balcony && <span className="error">{fieldErrors.balcony}</span>}
      </div>

      <div className="field">
        <label htmlFor="furnishing">Furnishing</label>
        <select id="furnishing" value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
          {FURNISHING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="transaction">Transaction</label>
        <select id="transaction" value={form.transaction} onChange={(e) => update("transaction", e.target.value)}>
          {TRANSACTION_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ownership">Ownership</label>
        <select id="ownership" value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
          {OWNERSHIP_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="facing">Facing</label>
        <select id="facing" value={form.facing} onChange={(e) => update("facing", e.target.value)}>
          {FACING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {serverError && <div className="form-error-banner">{serverError}</div>}

      <div className="submit-row">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Estimating…" : "Get estimate"}
        </button>
      </div>
    </form>
  );
}