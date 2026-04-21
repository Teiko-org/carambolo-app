import PropTypes from "prop-types";
import Svg, { G, Path, Rect, Defs, ClipPath } from "react-native-svg";

const SparkleIcon = ({ size = 13, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
    <G clipPath="url(#clip0_sparkle)">
      <Path
        d="M5.968 1.524a.542.542 0 01.532-.442c.253 0 .48.164.565.4l.57 3.01a1.625 1.625 0 001.098 1.098l3.01.57a.542.542 0 010 1.065l-3.01.569a1.625 1.625 0 00-1.099 1.099l-.569 3.01a.542.542 0 01-1.065 0l-.57-3.01a1.625 1.625 0 00-1.098-1.099l-3.01-.569a.542.542 0 010-1.065l3.01-.57a1.625 1.625 0 001.099-1.098l.569-3.01z"
        stroke={color}
        strokeWidth={1.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.833 1.083v2.167"
        stroke={color}
        strokeWidth={1.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.917 2.167H9.75"
        stroke={color}
        strokeWidth={1.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.167 11.917a1.083 1.083 0 100-2.167 1.083 1.083 0 000 2.167z"
        stroke={color}
        strokeWidth={1.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_sparkle">
        <Rect width={13} height={13} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

SparkleIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

SparkleIcon.defaultProps = {
  size: 13,
  color: "white",
};

export default SparkleIcon;
