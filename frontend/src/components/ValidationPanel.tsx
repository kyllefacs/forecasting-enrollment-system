import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type ValidationPanelProps = {
  errors: string[];

  warnings: string[];

  isValid: boolean;
};

export default function ValidationPanel({
  errors,
  warnings,
  isValid,
}: ValidationPanelProps) {

  return (
    <div className="space-y-4">

      {/* VALID */}
      {isValid && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">

          <CheckCircle2 className="text-green-600 w-6 h-6 mt-1" />

          <div>

            <h3 className="font-bold text-green-700">
              Dataset Ready
            </h3>

            <p className="text-green-600 text-sm mt-1">
              Your dataset passed validation and is ready for forecasting.
            </p>

          </div>

        </div>
      )}

      {/* ERRORS */}
      {errors.length > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">

          <h3 className="font-bold text-red-700 mb-2">
            Validation Errors
          </h3>

          <ul className="space-y-2">

            {errors.map((error, index) => (

              <li
                key={index}
                className="flex gap-2 text-red-600 text-sm"
              >

                <AlertTriangle className="w-4 h-4 mt-0.5" />

                {error}

              </li>

            ))}

          </ul>

        </div>

      )}

      {/* WARNINGS */}
      {warnings.length > 0 && (

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">

          <h3 className="font-bold text-yellow-700 mb-2">
            Warnings
          </h3>

          <ul className="space-y-2">

            {warnings.map((warning, index) => (

              <li
                key={index}
                className="flex gap-2 text-yellow-700 text-sm"
              >

                <AlertTriangle className="w-4 h-4 mt-0.5" />

                {warning}

              </li>

            ))}

          </ul>

        </div>

      )}

    </div>
  );
}