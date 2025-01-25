async function makeFetchRequest(requestType, endpoint, headers = [], jsonPayload = null) {
  try {
    // turn headers into an object
    const headersObject = headers.reduce((acc, header) => {
      const [key, value] = Object.entries(header)[0];
      acc[key] = value;
      return acc;
    }, {});

    const options = {
      method: requestType, // HTTP method like GET, POST, PUT, DELETE
      headers: {
        'Content-Type': 'application/json', // Default content type
        ...headersObject, // Spread custom headers
      },
    };

    // Include the body only if jsonPayload is provided
    if (jsonPayload && (requestType === 'POST' || requestType === 'PUT' || requestType === 'PATCH')) {
      options.body = jsonPayload;
    }

    const response = await fetch(endpoint, options);

    // TODO: Handle non-2xx status codes with failure path
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
    }

    // Attempt to parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch request failed:', error);
    throw error;
  }
}

export default makeFetchRequest