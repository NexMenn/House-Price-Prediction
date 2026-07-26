import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="title-block">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>That page doesn't exist. Head back to get a fresh estimate.</p>
      </div>
      <div className="panel center-col">
        <Link to="/" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
          Back to estimator
        </Link>
      </div>
    </div>
  );
}
