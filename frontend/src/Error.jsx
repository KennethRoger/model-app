import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ errorMessage = "Something went wrong!" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-8xl font-extrabold mb-4">Oops!</h1>
      <p className="text-3xl font-semibold mb-6">
        {errorMessage}
      </p>
      <p className="text-lg mb-8">
        We’re sorry, but it looks like something went wrong. Please try again later.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-200 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
