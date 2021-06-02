import { Box } from "@vofo-no/design";
import Image from "next/image";

const MsfHeader = (): JSX.Element => (
  <Box variant="light" boxShadow="small">
    <Box
      px={2}
      pb={1}
      pt={2}
      backgroundColor="#fff3ea"
      style={{ borderTop: "4px solid #e95b35" }}
    >
      <Box container>
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
      </Box>
    </Box>
  </Box>
);

export default MsfHeader;
