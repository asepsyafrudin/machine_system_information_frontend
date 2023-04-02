import { TypeAnimation } from "react-type-animation";

const TypeAnimationText = (props) => {
  const { text } = props;
  return (
    <TypeAnimation
      sequence={[text]}
      wrapper="span"
      speed={75}
      style={{
        whiteSpace: "pre-line",
        height: "195px",
        display: "block",
      }}
    />
  );
};

export default TypeAnimationText;
