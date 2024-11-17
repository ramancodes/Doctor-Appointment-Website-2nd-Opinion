import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res)=>{
    try{

        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {isAvailable: !docData.isAvailable})
        res.json({success:true, message:"Availability Changed"})

    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

const doctorsList = async (req, res)=>{
    try{
        const doctors = await doctorModel.find({}).select(['-password, -email'])
        res.json({success:true, doctors})
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {changeAvailability, doctorsList}