import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
};

export default function LabeledSelect({ 
  label, 
  options, 
  onChange, 
  required = false, 
  placeholder 
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Select onValueChange={onChange} required={required}>
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