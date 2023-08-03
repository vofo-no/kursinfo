import Container from "components/Containers/Container";
import WhiteBox from "components/Containers/WhiteBox";

function SktHeader() {
  return (
    <WhiteBox noPadding>
      <div className="border-b-4 border-b-[#c53283] py-3 px-2 tablet:px-6">
        <Container noPadding>
          <a
            className="text-[#c53283] text-xl font-['Helvetica_Neue',_Helvetica,_Arial,_sans-serif] no-underline hover:text-[#942662]"
            href="https://www.kulturogtradisjon.no/"
          >
            Studieforbundet kultur og tradisjon
          </a>
        </Container>
      </div>
    </WhiteBox>
  );
}

export default SktHeader;
