import AccessListLink from "../ui/AccessListLink";
import { kategoriPenugasan } from "../../utils/constant";

const ListPenugasan = () => {
  return (
    <>
      <AccessListLink
        data={kategoriPenugasan}
        title="Silahkan pilih kategori penugasan"
      />
    </>
  );
};

export default ListPenugasan;
