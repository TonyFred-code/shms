import { Loader2 } from "lucide-react";
import { number } from "prop-types";

export default function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-navy-600" />;
}

Spinner.propTypes = {
  size: number,
};
