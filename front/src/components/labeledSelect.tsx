import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  onChange: (value: string) => void;
  value?: string;
  required?: boolean;
  placeholder?: string;
};

export default function LabeledSelect({ 
  label, 
  options, 
  onChange, 
  value,
  required = false, 
  placeholder 
}: Props) {
  console.log(`LabeledSelect (${label}) - value recebido:`, value);
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Select onValueChange={onChange} value={value} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Selecione"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}