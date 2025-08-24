import { Loader2Icon } from "lucide-react";

const Spinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
  </div>
);
export default Spinner;