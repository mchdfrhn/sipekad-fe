
import { ArrowLeft, ArrowRight } from "lucide-react";

const ButtonPagination = ({ page, handlePageChange, totalPage }) => {
  return (
     <div className="flex gap-4 justify-end mt-4">
        <button onClick={() => handlePageChange(page - 1)} className="size-8 rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer disabled:text-gray-400" disabled={ page === 1 }><ArrowLeft /></button>
        {
          [...Array(totalPage)].map((_, index) => {
            const pageNumber = index + 1;
            return(
              <div className="flex gap-2">
                <button onClick={() => handlePageChange(pageNumber)} className="size-8 flex justify-center items-center rounded-full bg-white shadow-md">{ pageNumber }</button>
              </div>
            )
          })
        }
        <button onClick={() => handlePageChange(page + 1)} className="size-8 rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer disabled:text-gray-400" disabled={ page === totalPage }><ArrowRight /></button>
      </div>
  )
}

export default ButtonPagination;