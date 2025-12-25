export default function FormInput({ label, type = 'text', value, onChange, placeholder, required = false, name }) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                name={name}
                className="input-field"
            />
            <style jsx>{`
        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-weight: 600;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .input-field {
          background: #111;
          border: 1px solid #333;
          padding: 12px 16px;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .input-field:focus {
          border-color: #e11d48;
          outline: none;
        }
      `}</style>
        </div>
    );
}
