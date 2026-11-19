import ListLink from '../ui/ListLink'
import { kategoriPengajuan } from '../../utils/constant'
import PageHeader from "@/components/ui/PageHeader";
import { FilePlus2 } from "lucide-react";

const ListPengajuan = () => {
  return (
    <div className="space-y-4">
      <PageHeader icon={FilePlus2} title="Buat Pengajuan Baru" description="Pilih jenis surat yang ingin Anda ajukan" />
      <ListLink data={kategoriPengajuan} title={'Silahkan pilih jenis surat pengajuan'} />
    </div>
  )
}

export default ListPengajuan
