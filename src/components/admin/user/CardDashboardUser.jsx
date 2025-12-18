const CardDashboardUser = ({ title, value, className }) => {
  return (
    <div className={`flex flex-col p-2 hover:-translate-y-2 transition-transform duration-200 cursor-pointer ease-in-out rounded-md ${ className }`}>
        <span className="text-white font-bold">{title}</span>
        <span className="text-4xl mt-2 text-white font-bold">{ value }</span>
    </div>
  )
}

export default CardDashboardUser