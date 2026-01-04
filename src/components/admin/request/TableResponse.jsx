import IframeRequest from "./IframeRequest";
import { useState } from "react";

const TableResponse = ({ dataKey, response }) => {
  const [isDisplay, setIsDisplay] = useState(false);
  return (
    <>
    <table className="w-full ">
      <thead>
        <tr>
          {dataKey.map((data) => (
            <th
              key={data}
              className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell"
            >
              {data}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {response.map((value, index) => (
          <tr
            key={index}
            className="flex flex-row hover:shadow-md cursor-pointer transition-all transition-duration justify-between gap-4 items-center md:table-row mb-4 md:mb-0 md:border-b-4 border-gray-600 md:border-none md:p-0"
          >
            <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
              {index + 1}
            </td>
            <td className="md:px-6 py-2 md:py-4 hidden text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
              {value.message}
            </td>
            <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
              {new Date(value.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </td>
            { value.url ?
              <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
              <button onClick={() => setIsDisplay(!isDisplay)}  className="text-white border transition-duration-color bg-blue-500 py-1 cursor-pointer hover:bg-transparent hover:text-blue-500 hover:border-blue-500 px-2 text-xs md:text-[16px] rounded-md">Buka file</button>
               {
                 isDisplay && <div onClick={() => setIsDisplay(!isDisplay)} className="fixed inset-0 w-screen h-screen bg-gray-800/10 z-99 flex justify-center items-center">
                    <IframeRequest url={response[index].url} className={"w-[40rem] "} />
                 </div>
                }
            </td>
            : 
            <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
              tidak ada file
            </td>
            }
            
          </tr>
        ))}
      </tbody>
    </table>
    
    </>
  );
};

export default TableResponse;
