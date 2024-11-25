import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    bookedDate: {type: String, default:''},
    bookedTime: {type: String, default:''},
    slotDate: {type: String, required: true },
    slotTime: {type: String, required: true },
    completedDate: {type: String, default:''},
    completedTime: {type: String, default:''},
    userData: {type: Object, required: true },
    docData: {type: Object, required: true },
    amount: {type: Number, required: true },
    date: {type: Number, required: true },
    cancelled: {type: Boolean, default: false},
    payment: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
}, {minimize:false})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel