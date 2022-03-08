import { Box } from "@vofo-no/design";
import Image from "next/image";

const KstudHeader = (): JSX.Element => (
  <Box variant="light" boxShadow="small">
    <Box
      px={2}
      pb={1}
      pt={2}
      backgroundColor="#f8f8f8"
      style={{ borderBottom: "1px solid #e7e7e7" }}
    >
      <Box container>
        <a href="https://www.k-stud.no/">
          <Image
            width={155}
            height={48}
            layout="intrinsic"
            src="/KstudLogo.png"
            alt="Kristelig studieforbund"
          />
        </a>
      </Box>
    </Box>
  </Box>
);

export default KstudHeader;
