import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2Icon className="size-8 animate-spin text-emerald-500" />
    </div>
  );
};

export default Loading;
