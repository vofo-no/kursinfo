import Container from "components/Containers/Container";
import WhiteBox from "components/Containers/WhiteBox";
import Image from "next/image";

function MsfHeader() {
  return (
    <WhiteBox noPadding>
      <div className="bg-[#fff3ea] border-t-4 border-t-[#e95b35] pt-4 pb-2 px-2 tablet:px-6">
        <Container noPadding>
          <a href="https://www.musikkensstudieforbund.no/">
            <Image
              sizes="(max-width: 750px) 151px, 213px"
              width={213}
              height={45}
              layout="intrinsic"
              src="/MsfLogo.png"
              alt="Musikkens studieforbund"
            />
          </a>
        </Container>
      </div>
    </WhiteBox>
  );
}

export default MsfHeader;
