import { Outlet } from 'react-router'
import BackLink from '../ui/BackLink'

const SuratPengajuan = () => {
  return (
    <>
    <BackLink />
      <Outlet />
    </>
    
  )
}

export default SuratPengajuan