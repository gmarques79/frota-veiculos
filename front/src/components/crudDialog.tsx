import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Loader2 } from "lucide-react";
  import { ReactNode } from "react";
  
  interface CrudDialogProps {
    triggerText: string;
    title: string;
    children: ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isSubmitting: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export function CrudDialog({
    triggerText,
    title,
    children,
    onSubmit,
    isSubmitting,
    isOpen,
    onOpenChange,
  }: CrudDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>{triggerText}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }