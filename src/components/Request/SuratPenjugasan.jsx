import { Outlet } from "react-router"
import BackLink from "../ui/BackLink"

const SuratPenjugasan = () => {
  return (
    <>
      <BackLink />
      <Outlet />
    </>
  )
}

export default SuratPenjugasan