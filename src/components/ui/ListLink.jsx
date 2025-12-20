import { Link } from "react-router";
import Underline from "./Underline";

const ListLink = ({ data, title }) => {
  return (
    <>
      <h1 className="font-semibold text-slate-800 xl:text-2xl">{title}</h1>
      <Underline />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4 md:gap-8">
        {data.map((data, index) => (
          <Link
            key={index}
            to={data.path}
            className={`${data.color} shadow-xl`}
          >
            {data.content}
          </Link>
        ))}
      </div>
    </>
  );
};

export default ListLink;
