import { Box } from "@vofo-no/design";

const SktHeader: React.FC<Record<string, never>> = () => (
  <Box variant="light" boxShadow="small">
    <div className="c-header">
      <Box px={2} py={1}>
        <Box container>
          <a className="brand" href="https://www.kulturogtradisjon.no/">
            Studieforbundet kultur og tradisjon
          </a>
        </Box>
      </Box>
    </div>
    <style jsx>{`
      .c-header {
        border-bottom: 4px solid #c53283;
      }
      a.brand {
        font-size: 20px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #c53283;
        text-decoration: none;
      }
      a.brand:hover {
        color: #942662;
      }
    `}</style>
  </Box>
);

export default SktHeader;
