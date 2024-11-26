import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify'

const AllReports = () => {

    const { aToken, reports, getAllReports, cancelReport } = useContext(AdminContext);
    const { slotDateFormat, currency } = useContext(AppContext);

    const downloadFile = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl)
            const blob = await response.blob()
            saveAs(blob, 'downloaded-file.pdf')
        } catch (error) {
            console.error(error);
            toast.error('Error downloading the file:', error)
        }
    }

    useEffect(() => {
        if (aToken) {
        getAllReports();
        }
    }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Reports</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[70vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr_2fr_3fr_1.5fr_1.5fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>User Report</p>
          <p>Doctor Report</p>
          <p>Posted</p>
          <p>Accepted</p>
          <p>Completed</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p className="text-center">Action</p>
        </div>

        {reports.map((item, index) => (
          <div key={index} className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr_2fr_3fr_1.5fr_1.5fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50">
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={item.userData.image}
                alt=""
              />{" "}
              <p>{item.userData.name}</p>
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              {
                item.report 
                ? <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.report)}>Download</button>
                : <p className="text-xs">Not Available</p>
              }
                
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              {
                item.doctorReport 
                ? <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.doctorReport)}>Download</button>
                : <p className="text-xs">Not Available</p>
              }
                
                
            </div>

            <div>
                {item.appliedDate
                    ? <p>{slotDateFormat(item.appliedDate)}, <br /> {item.appliedTime} </p>
                    : <p className="text-xs">Not Available</p>}
            </div>

            <div>
                {item.acceptedDate
                    ? <p>{slotDateFormat(item.acceptedDate)}, <br /> {item.acceptedTime} </p>
                    : <p className="text-xs">Not Available</p>}
            </div>

            <div>
                {item.completedDate
                    ? <p>{slotDateFormat(item.completedDate)}, <br /> {item.completedTime} </p>
                    : <p className="text-xs">Not Available</p>}
            </div>

            {
                item.docId
                ? <div className="flex items-center gap-2">
                    <img className="w-8 rounded-full bg-gray-200" src={item.docData.image} alt="" />{" "}
                    <p>{item.docData.name}</p>
                </div>
                : <p className="text-xs">Not Accepted</p>
            }

            {
                item.docId
                ? <p>
                    {currency} {item.amount}
                </p>
                : <p className="text-xs">Not Available</p>
            }

            <div className="flex justify-center items-center">
                {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
                ) : (
                <img
                    onClick={() => cancelReport(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                />
                )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllReports;
