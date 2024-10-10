import Container from "@/components/Containers/Container";
import WhiteBox from "@/components/Containers/WhiteBox";

function NmHeader() {
  return (
    <WhiteBox noPadding>
      <div className="bg-[#00AC58] py-3 px-2 tablet:px-6">
        <Container noPadding>
          <a
            className=" text-white text-xl font-['Helvetica_Neue',_Helvetica,_Arial,_sans-serif] no-underline hover:text-[#cceede]"
            href="https://www.naturogmiljo.no"
          >
            Studieforbundet natur og miljø
          </a>
        </Container>
      </div>
    </WhiteBox>
  );
}

export default NmHeader;
