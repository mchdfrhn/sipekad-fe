
export default function FIlterControl({ onChangeHandler }) {
//   const onChangeHandler = async(e) => {
//     const status = e.target.value
//     let getAllData = status === "default";
//     await filterStatus(status, setRequest, setPage, setTotalPage, getAllData);
//   }  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Filter Status:</span>

      <select
        onChange={onChangeHandler}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none "
      >
        <option value="default">
          Default
        </option>
        <option value="pending">
          Pending
        </option>
        <option value="canceled">
          Canceled
        </option>
        <option value="completed">
          Success
        </option>
      </select>
    </div>
  );
}