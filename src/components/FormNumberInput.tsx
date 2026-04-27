type FormNumberInputProps = {
  type: string;
  name: string;
  value: string | number;
  min: number;
  maxLength: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
};

export default function FormNumberInput({
  type,
  name,
  value,
  min,
  maxLength,
  onChange,
  labelText,
}: FormNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent typing more digits than allowed
    if (e.target.value.length <= maxLength) {
      onChange(e);
    }
  };
  return (
    <div className="form-input">
      <label htmlFor={name}>{labelText}</label>
      <input
        type={type}
        id={name}
        name={name}
        required
        value={value}
        min={min}
        maxLength={maxLength}
        onChange={handleChange}
      />
    </div>
  );
}
