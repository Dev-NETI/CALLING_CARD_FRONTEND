import { forwardRef } from "react";
import { Employee } from "@/types";

interface IDCardFrontProps {
  employee: Employee;
}

/**
 * Text coordinates for overlaying employee information on the front template
 *
 * Template dimensions: 590px x 1000px
 *
 * Coordinates (adjustable):
 * - Name: Centered at y: 540px
 * - Position: Centered at y: 590px
 * - Employee ID: Centered at y: 890px
 */
const TEXT_COORDINATES = {
  name: {
    top: "465px",
    fontSize: "34px",
    color: "#FFFFFF",
    fontWeight: "900",
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    lineHeight: "1.1",
  },
  position: {
    top: "558px",
    fontSize: "22px",
    color: "#FFFFFF",
    fontWeight: "700",
    textTransform: "uppercase" as const,
  },
  employeeId: {
    top: "790px",
    fontSize: "28px",
    color: "#1B3B6F",
    fontWeight: "900",
    letterSpacing: "0.05em",
  },
};

const IDCardFront = forwardRef<HTMLDivElement, IDCardFrontProps>(
  ({ employee }, ref) => {
    const fullName = `${employee.first_name} ${
      employee.middle_name ? employee.middle_name.charAt(0) + "." : ""
    } ${employee.last_name}`;

    return (
      <div
        ref={ref}
        className="relative bg-white"
        style={{ width: "590px", height: "1000px" }}
      >
        {/* Background Template Image */}
        <img
          src="/assets/emp_id/Front.png"
          alt="ID Card Front Template"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Employee Name Overlay */}
        <div
          className="absolute left-0 right-0 text-center"
          style={{
            top: TEXT_COORDINATES.name.top,
            fontSize: TEXT_COORDINATES.name.fontSize,
            color: TEXT_COORDINATES.name.color,
            fontWeight: TEXT_COORDINATES.name.fontWeight,
            textTransform: TEXT_COORDINATES.name.textTransform,
            letterSpacing: TEXT_COORDINATES.name.letterSpacing,
            lineHeight: TEXT_COORDINATES.name.lineHeight,
            fontFamily: "Arial, sans-serif",
            padding: "0 32px",
            zIndex: 10,
          }}
        >
          {fullName}
        </div>

        {/* Employee Position Overlay */}
        <div
          className="absolute left-0 right-0 text-center"
          style={{
            top: TEXT_COORDINATES.position.top,
            fontSize: TEXT_COORDINATES.position.fontSize,
            color: TEXT_COORDINATES.position.color,
            fontWeight: TEXT_COORDINATES.position.fontWeight,
            textTransform: TEXT_COORDINATES.position.textTransform,
            fontFamily: "Arial, sans-serif",
            padding: "0 32px",
            zIndex: 10,
          }}
        >
          {employee.position}
        </div>

        {/* Employee ID Number Overlay */}
        <div
          className="absolute left-0 right-0 text-center"
          style={{
            top: TEXT_COORDINATES.employeeId.top,
            fontSize: TEXT_COORDINATES.employeeId.fontSize,
            color: TEXT_COORDINATES.employeeId.color,
            fontWeight: TEXT_COORDINATES.employeeId.fontWeight,
            letterSpacing: TEXT_COORDINATES.employeeId.letterSpacing,
            fontFamily: "Arial, sans-serif",
            zIndex: 10,
          }}
        >
          EMPLOYEE NO: {employee.employee_id}
        </div>
      </div>
    );
  }
);

IDCardFront.displayName = "IDCardFront";

export default IDCardFront;

/**
 * COORDINATE REFERENCE GUIDE
 * ===========================
 *
 * To adjust text positions, modify the TEXT_COORDINATES object above.
 *
 * Current coordinates:
 * - Name: 540px from top (white text on blue background)
 * - Position: 590px from top (white text on blue background)
 * - Employee ID: 890px from top (blue text on white/gray background)
 *
 * All text is horizontally centered automatically.
 *
 * To change colors, fonts, or sizes, edit the corresponding properties
 * in the TEXT_COORDINATES object.
 */
