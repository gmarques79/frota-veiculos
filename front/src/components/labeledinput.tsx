import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
};

export default function LabeledInput({ label, value = '', ...props }: Props) {
  console.log(`Labeledinput (${label}) - value recebido:`, value);  // Verifique o valor recebido

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input 
        value={value} 
        {...props}  // Passa as outras props como onChange, required, etc.
      />
    </div>
  );
}
