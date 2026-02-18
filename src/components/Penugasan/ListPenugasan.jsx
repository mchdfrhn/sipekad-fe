import ListLink from "../ui/ListLink";
import { kategoriPenugasan } from "../../utils/constant";
import HomeLinkButton from "../ui/HomeLinkButton";
import CancelRequesrContent from "../ui/CancelRequesrContent";

const ListPenugasan = () => {
  return (
    <>
      <ListLink
        data={kategoriPenugasan}
        title="Silahkan pilih kategori penugasan"
      />
    </>
  );
};

export default ListPenugasan;
