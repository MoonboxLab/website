const list = [
  {
    id: 1,
    name: "card1",
    img: "/bid/bid-card.webp",
    price: 100,
    coin: "USDT",
    desc: "desc1",
  },
  {
    id: 2,
    name: "card2",
    img: "/bid/bid-card.webp",
    price: 100,
    coin: "USDT",
    desc: "desc2",
  },
  {
    id: 3,
    name: "card3",
    img: "/bid/bid-card.webp",
    price: 100,
    coin: "USDT",
    desc: "desc3",
  },
  {
    id: 4,
    name: "card4",
    img: "/bid/bid-card.webp",
    price: 100,
    coin: "USDT",
    desc: "desc4",
  },
  {
    id: 5,
    name: "card5",
    img: "/bid/bid-card.webp",
    price: 100,
    coin: "USDT",
    desc: "desc5",
  },
];

export function getBigList() {
  return list;
}

export function getBigItem(id: number) {
  return list.find((item) => item.id === id);
}
