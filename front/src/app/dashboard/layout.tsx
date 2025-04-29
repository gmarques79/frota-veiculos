"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // já vem pronto com shadcn

const menuItems = [
  { label: "Início", href: "/dashboard/home" },
  { label: "Perfil", href: "/dashboard/perfil" },
  { label: "Veículos", href: "/dashboard/veiculos" },
  { label: "Condutores", href: "/dashboard/condutores" },
  { label: "Saídas", href: "/dashboard/saidas" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar com shadcn + animação */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 p-4 bg-blue-900 text-white"
      >
        <Card className="bg-blue-900 text-white border-none shadow-none">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6">Menu</h2>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start",
                    pathname === item.href && "bg-blue-700 text-white hover:bg-blue-600"
                  )}
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
        </Card>
      </motion.aside>

      {/* Conteúdo principal com fade in */}
      <motion.main
        className="flex-1 p-6 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
