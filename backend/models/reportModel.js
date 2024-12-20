import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, default: '' },
    report: {type: String, required: true },
    doctorReport: {type: String, default: '' },
    speciality: {type: String, required: true },
    symptoms: {type: Array, required: true },
    appliedDate: {type: String, default: ''},
    appliedTime: {type: String, default: ''},
    acceptedDate: {type: String, default: ''},
    acceptedTime: {type: String, default: ''},
    completedDate: {type: String, default: ''},
    completedTime: {type: String, default: ''},
    userData: {type: Object, required: true },
    docData: {type: Object, default:{}},
    amount: {type: Number, default: ''},
    date: {type: Number, required: true },
    cancelled: {type: Boolean, default: false},
    payment: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
}, {minimize:false})

const reportModel = mongoose.models.secondOpinionReport || mongoose.model('secondOpinionReport', reportSchema)

export default reportModel