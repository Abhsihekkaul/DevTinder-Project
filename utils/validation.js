function validateEditors(req) {
    const AllowededFields = ["firstName", "lastName", "Age", "Gender", "Skills", "PhotoUrl"]; // Fixed typo

    const isValidEdit = Object.keys(req.body).every((field) => AllowededFields.includes(field));

    return isValidEdit;
}

module.exports = validateEditors;
