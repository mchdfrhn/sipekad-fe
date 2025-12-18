const CardDashboard = ({ title, value }) => {
  return (
    <div className="card-dashboard shadow-md">
        <span className="text-sm font-semibold border-b pb-2">{ title }</span>
        <span className="text-end text-4xl px-2">{ value }</span>
    </div>
  )
}

export default CardDashboard