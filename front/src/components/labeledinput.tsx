import { Input } from "./ui/input";

// components/LabeledInput.tsx
type Props = {
    label: string;
    type?: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
  };
  
export default function LabeledInput({ label, value='', ...props }: Props) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Input {...props} />
      </div>
    );
  }
  