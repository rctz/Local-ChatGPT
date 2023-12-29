function DefineMessageType(message) {
  const codeRegex = /```(.*?)```/s;
  let fragments = [];
  let remainingText = message;

  while (true) {
    const codeMatch = remainingText.match(codeRegex);
    if (!codeMatch) break;

    const normalTextFragment = remainingText
      .substring(0, codeMatch.index)
      .trim();
    const codeTextFragment = codeMatch[1].trim();

    if (normalTextFragment) {
      fragments.push({
        type: "text",
        lang: "en",
        content: normalTextFragment,
      });
    }
    if (codeTextFragment) {
      const lines = codeTextFragment.split("\n");
      const language = lines[0];

      lines.shift();
      const remainingLines = lines.join("\n");
      fragments.push({
        type: "code",
        lang: language,
        content: remainingLines,
      });
    }

    remainingText = remainingText.substring(
      codeMatch.index + codeMatch[0].length
    );
  }

  if (remainingText.trim()) {
    fragments.push({
      type: "text",
      lang: "en",
      content: remainingText.trim(),
    });
  }

  return fragments;
}

module.exports = { DefineMessageType };
