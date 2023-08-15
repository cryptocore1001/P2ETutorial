import { useEffect, useState } from "react";

const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      // Handle the error, e.g., log it to the console
      console.error("Error caught by error boundary:", error);
      // Optionally, you can set a flag to indicate an error occurred
      setHasError(true);
    };

    // Attach the error handler to the window's 'error' event
    window.addEventListener("error", errorHandler);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  return hasError;
};

export default useErrorBoundary;
