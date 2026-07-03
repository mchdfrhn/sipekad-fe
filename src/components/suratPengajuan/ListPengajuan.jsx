import ListLink from '../ui/ListLink'
import { kategoriPengajuan } from '../../utils/constant'

const ListPengajuan = () => {
  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B3674] tracking-tight">Buat Pengajuan Baru</h1>
        <p className="text-sm text-[#718096] mt-1">Pilih jenis surat yang ingin Anda ajukan</p>
      </div>
      <ListLink data={kategoriPengajuan} title={'Silahkan pilih jenis surat pengajuan'} />
    </div>
  )
}

export default ListPengajuan
