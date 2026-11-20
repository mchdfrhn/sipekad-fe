import AccessListLink from "../ui/AccessListLink";
import { kategoriKeterangan } from "../../utils/constant";

const ListKeterangan = () => {
  return (
    <>
    <AccessListLink data={kategoriKeterangan} title={'Silahkan pilih jenis keterangan'} />
    </>
  );
};

export default ListKeterangan;
