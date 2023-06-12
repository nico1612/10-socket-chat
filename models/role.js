import pkg from 'mongoose';
const {Schema,model} = pkg;

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

export const Role= model("Role",RoleSchema)