import { Box } from "@vofo-no/design";

const NmHeader: React.FC<Record<string, never>> = () => (
  <Box variant="primary" boxShadow="small">
    <Box backgroundColor="#00AC58" px={2} py={1}>
      <Box container>
        <a className="brand" href="https://www.naturogmiljo.no">
          Studieforbundet natur og miljø
        </a>
      </Box>
    </Box>
    <style jsx>{`
      a.brand {
        font-size: 20px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #fff;
        text-decoration: none;
      }
      a.brand:hover {
        color: #cceede;
      }
    `}</style>
  </Box>
);

export default NmHeader;
