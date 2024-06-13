export default function updateDifficulty(correct, currentDifficulty) {
  if (correct) {
    return currentDifficulty < 4 ? currentDifficulty + 1 : 4;
  } else {
    return currentDifficulty > 1 ? currentDifficulty - 1 : 1;
  }
}
