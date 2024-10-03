export default function generateKey() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBlock = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const part1 = randomBlock(4); // h34e
  const part2 = randomBlock(4); // SK32
  const part3 = randomBlock(4); // 0MA4
  const part4 = randomBlock(4); // DCV2

  return `${part1}-${part2}-${part3}-${part4}`;
}
