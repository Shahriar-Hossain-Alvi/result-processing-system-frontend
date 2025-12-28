
const errorMessageParser = (error) => {
    console.log(error);
    const detail = error?.response?.data?.detail; // extract the detail property from the response
    const message = Array.isArray(detail) ? detail[0]?.msg : detail;
    return message;
}

export default errorMessageParser
