"use client";

import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  progress: number;
}

export function Header({ progress }: HeaderProps) {
  return (
    <header className="border-b bg-card px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          Yudisium Journey Planner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau perjalanan yudisium dari revisi sidang sampai SIYUDIS.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
        {progress === 100 && (
          <div className="mt-3 rounded-md bg-green-50 border border-green-200 p-3 text-sm font-medium text-green-800">
            🎉 Yudisium siap diajukan! Semua tahapan sudah selesai.
          </div>
        )}
      </div>
    </header>
  );
}
