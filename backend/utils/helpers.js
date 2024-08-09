const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateUniqueID = (userType) => {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    return `${userType.charAt(0).toUpperCase()}${randomNumber}`;
};

module.exports = { generateOTP, generateUniqueID };
