const validateSignUpData = (req) => {
    const ALLOWED_FIELDS = [
        'firstName',
        'lastName',
        'emailId',
        'password',
        'age',
        'gender',
        'photoUrl',
        'about',
        'skills'
    ];

    const isValidOperation = Object.keys(req.body).every((key) => ALLOWED_FIELDS.includes(key));
    if (!isValidOperation) {
        throw new Error("Invalid fields in request body");
    }
    const { firstName, emailId, password } = req.body;

    if (!firstName) {
        throw new Error("firstName is required");
    }
    if (!emailId) {
        throw new Error("emailId is required");
    }
    if (!password) {
        throw new Error("password is required");
    }
}

const validateEditProfileData = (req) => {
    const ALLOWED_FIELDS = [
        'firstName',
        'lastName',
        'age',
        'gender',
        'photoUrl',
        'about',
        'skills'
    ];

    const updateFields = Object.keys(req.body).filter((key) => key !== 'emailId');

    if (updateFields.length === 0) {
        throw new Error("Provide at least one field to update")
    }
    const isUpdateAllowed = updateFields.every((key) => ALLOWED_FIELDS.includes(key));

    if (!isUpdateAllowed) {
        const invalidFields = updateFields.filter((key) => ALLOWED_FIELDS.includes(key));

        throw new Error(`Invalid fields in request body: ${invalidFields.join(', ')}`);
    }



}

modules.exports = { validateSignUpData, validateEditProfileData };