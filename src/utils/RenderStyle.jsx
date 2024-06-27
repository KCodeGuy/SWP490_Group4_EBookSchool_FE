const renderAverageMarkStyles = (averageMark) => {
  let defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded";
  if (averageMark >= 8) {
    defaultStyles = `${defaultStyles} bg-success-color`;
  } else if (averageMark >= 6.5 && averageMark < 8) {
    defaultStyles = `${defaultStyles} bg-primary-color`;
  } else if (averageMark >= 5 && averageMark < 6.5) {
    defaultStyles = `${defaultStyles} bg-warning-color`;
  } else if (averageMark < 5) {
    defaultStyles = `${defaultStyles} bg-error-color`;
  }
  return defaultStyles;
};

const renderRanking = (averageMark) => {
  let ranking = "";
  if (averageMark >= 8) {
    ranking = "Giỏi";
  } else if (averageMark >= 6.5 && averageMark < 8) {
    ranking = "Khá";
  } else if (averageMark >= 5 && averageMark < 6.5) {
    ranking = "Trung bình";
  } else if (averageMark < 5) {
    ranking = "Kém";
  } else if (averageMark == -1) {
    ranking = "Chưa xếp loại";
  }
  return ranking;
};

const renderRankingStyles = (averageMark) => {
  let defaultStyles = "italic font-medium";
  if (averageMark >= 8) {
    defaultStyles = `${defaultStyles} success-color`;
  } else if (averageMark >= 6.5 && averageMark < 8) {
    defaultStyles = `${defaultStyles} primary-color`;
  } else if (averageMark >= 5 && averageMark < 6.5) {
    defaultStyles = `${defaultStyles} warning-color`;
  } else if (averageMark < 5) {
    defaultStyles = `${defaultStyles} error-color`;
  }
  return defaultStyles;
};

export { renderAverageMarkStyles, renderRanking, renderRankingStyles };