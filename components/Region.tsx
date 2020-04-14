interface RegionProps {
  name: string;
  year: number;
}

const Region = ({ name, year }: RegionProps): JSX.Element => (
  <h1>
    Hello {name} i {year}!
  </h1>
);

export default Region;
