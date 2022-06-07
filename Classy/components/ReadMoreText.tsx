import { useCallback, useState } from "react";

import Colors from "../constants/Colors";
import { Text } from "./Themed";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";

export default function ReadMoreText({ text }: { text: string }) {
  const colorScheme = useColorScheme();

  const [showFullText, setShowFullText] = useState(true);
  const [isLongText, setIsLongText] = useState(true);
  const [textLoaded, setTextLoaded] = useState(false);

  const onTextLayout = useCallback(
    (e) => {
      if (!textLoaded && showFullText) {
        setIsLongText(e.nativeEvent.lines.length > 5);
        setShowFullText(false);
        setTextLoaded(true);
      }
    },
    [showFullText]
  );

  return (
    <>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={showFullText ? undefined : 5}
      >
        {/* TODO: figure out decoding e.g. {decodeURIComponent(course.description)} */}
        {text}
      </Text>
      {isLongText && (
        <Text
          onPress={() => setShowFullText(!showFullText)}
          style={{
            color: Colors[colorScheme].tint,
            alignSelf: "flex-end",
            marginTop: Layout.spacing.xxsmall,
          }}
        >
          {showFullText ? "Read less" : "Read more"}
        </Text>
      )}
    </>
  );
}
