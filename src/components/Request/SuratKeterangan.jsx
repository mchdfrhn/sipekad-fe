import { Outlet } from "react-router"
import BackLink from "../ui/BackLink"

const SuratKeterangan = () => {
  return (
    <>
      <BackLink />
      <Outlet />
    </>
  )
}

export default SuratKeterangan