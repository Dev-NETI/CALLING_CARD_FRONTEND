import { forwardRef } from "react";

interface IDCardBackProps {}

const IDCardBack = forwardRef<HTMLDivElement, IDCardBackProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className="relative bg-[#1B3B6F]"
      style={{ width: "590px", height: "1000px" }}
    >
      {/* Background Template Image */}
      <img
        src="/assets/emp_id/Back.png"
        alt="ID Card Back Template"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
});

IDCardBack.displayName = "IDCardBack";

export default IDCardBack;
