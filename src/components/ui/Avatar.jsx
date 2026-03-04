import { oneOf, string } from "prop-types";

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function Avatar({ initials, size = "md" }) {
  return (
    <div
      className={`${sizes[size]} rounded-full bg-navy-700 text-white font-semibold flex items-center justify-center shrink-0 font-body`}
    >
      {initials}
    </div>
  );
}

Avatar.propTypes = {
  initials: string.isRequired,
  size: oneOf(Object.keys(sizes)),
};
