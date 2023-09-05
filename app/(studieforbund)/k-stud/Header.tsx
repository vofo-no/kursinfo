import Container from "components/Containers/Container";
import Image from "next/image";

function KstudHeader() {
  return (
    <div className="bg-[#f8f8f8] border-b border-b-gray-300">
      <Container noPadding>
        <a
          href="https://www.k-stud.no/"
          className="inline-block mx-2 tablet:mx-6 mt-4 mb-2"
        >
          <Image
            width={155}
            height={48}
            layout="intrinsic"
            src="/KstudLogo.png"
            alt="Kristelig studieforbund"
          />
        </a>
      </Container>
    </div>
  );
}

export default KstudHeader;
