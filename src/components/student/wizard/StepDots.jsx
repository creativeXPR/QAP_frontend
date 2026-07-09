/**
 * The design uses 3 dots to represent 3 *phases*, even though the flow
 * has 5 actual screens: Type (dot 0), Details (dot 1), and then Privacy
 * Mode / Attachments / Review all share dot 2 as the final phase.
 */
export default function StepDots({ activeDot, total = 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === activeDot ? "w-8 bg-brand" : "w-1.5 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}