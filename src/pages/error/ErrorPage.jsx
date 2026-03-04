import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import { func, string } from "prop-types";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage = null;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      // Should never happen
      // Router has a "*" path for NotFoundPage
      errorMessage = "This page doesn't exist";
    }

    if (error.status === 401) {
      errorMessage = "You aren't authorized to see this";
    }

    if (error.status === 503) {
      errorMessage = "Looks like our API is down";
    }
  }

  if (!errorMessage) {
    errorMessage = error.data || error.message || "An unknown error occurred.";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <p className="text-2xl font-display text-navy-950">
          Something went wrong
        </p>
        <p className="text-sm text-gray-500 mt-3 max-w-sm">
          An unexpected error occurred. You can try refreshing the page or
          return home.
        </p>
        {errorMessage && (
          <p className="text-xs text-gray-400 font-mono mt-3 bg-gray-100 rounded-lg px-4 py-2 max-w-sm mx-auto break-all">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link
          to={"/"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white text-sm hover:bg-navy-800 transition-colors"
        >
          <Home size={15} /> Home
        </Link>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  resetError: func.isRequired,
  errorMessage: string,
};
