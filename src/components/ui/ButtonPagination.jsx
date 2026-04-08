import { ArrowLeft, ArrowRight } from "lucide-react";
import { generatePaginationPages } from "../../utils/helpers";
import { Button } from "./button";

const ButtonPagination = ({ page, handlePageChange, totalPage }) => {
  if (totalPage <= 1) return null;

  return (
    <div className="flex justify-end items-center gap-2 mt-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="rounded-full hover:bg-gray-100 disabled:opacity-50 h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {generatePaginationPages(page, totalPage).map((pageNumber, index) => {
        if (pageNumber === "..") {
          return (
            <span key={`dots-${index}`} className="px-2 text-gray-400 font-bold">
              ..
            </span>
          );
        }
        return (
          <Button
            key={pageNumber}
            variant={page === pageNumber ? "default" : "ghost"}
            onClick={() => handlePageChange(pageNumber)}
            className={`h-8 w-8 rounded-full p-0 text-xs font-bold ${
              page === pageNumber
                ? "bg-[#4318FF] text-white hover:bg-[#3311CC]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPage}
        className="rounded-full hover:bg-gray-100 disabled:opacity-50 h-8 w-8"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ButtonPagination;