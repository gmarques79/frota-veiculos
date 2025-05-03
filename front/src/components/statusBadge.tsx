import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isActive: boolean;
}

export function StatusBadge({ isActive }: StatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "destructive"}>
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}