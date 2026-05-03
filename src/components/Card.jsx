const Card = ({ number, title, description }) => {
  return (
    <div className="card">
      {number && (
        <div className="card-number" aria-hidden="true">
          {number}
        </div>
      )}
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7' }}>
        {description}
      </p>
    </div>
  )
}

export default Card;
