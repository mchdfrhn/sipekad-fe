import { Link } from "react-router"

const Button = ({ path, content, className }) => {
  return (
    <Link to={ path } className={` ${ className } button-yellow-home`}>{ content }</Link>
  )
}

export default Button